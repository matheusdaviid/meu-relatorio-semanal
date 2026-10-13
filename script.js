document.addEventListener("DOMContentLoaded", () => {
    const botao = document.getElementById("btnGerarPDF");
    const formulario = document.getElementById("relatorioForm");
    const template = document.getElementById("pdfTemplate");

    const valor = id => {
        const campo = document.getElementById(id);
        return campo ? campo.value.trim() : "";
    };

    const numero = id => {
        const texto = valor(id);
        if (texto === "") return null;
        const n = Number(texto);
        return Number.isFinite(n) && n >= 0 ? n : null;
    };

    const formatarNumero = n => n === null || n === undefined ? "Não informado" : n.toLocaleString("pt-BR");
    const textoOu = (id, alternativa = "Nenhum registro informado.") => valor(id) || alternativa;

    const preencher = (id, conteudo) => {
        const el = document.getElementById(id);
        if (el) el.textContent = conteudo;
    };

    const dataBR = data => {
        if (!data) return "Não informado";
        const [ano, mes, dia] = data.split("-");
        return `${dia}/${mes}/${ano}`;
    };

    const percentual = (parte, total) => {
        if (parte === null || total === null || total === 0) return "Não informado";
        return `${(parte / total * 100).toLocaleString("pt-BR", { maximumFractionDigits: 1 })}%`;
    };

    const preencherBarra = (barId, valorId, n, maximo) => {
        preencher(valorId, formatarNumero(n));
        const barra = document.getElementById(barId);
        if (!barra) return;
        barra.style.width = n === null || maximo === null || maximo <= 0 ? "0%" : `${Math.min(100, n / maximo * 100)}%`;
        barra.style.opacity = n === null ? "0.18" : "1";
    };

    const preencherCamposNumericos = (mapa) => {
        Object.entries(mapa).forEach(([campo, destino]) => {
            preencher(destino, formatarNumero(numero(campo)));
        });
    };

    botao.addEventListener("click", async () => {
        if (!formulario.reportValidity()) return;

        if (!window.html2canvas || !window.jspdf?.jsPDF) {
            alert("As bibliotecas não carregaram. Verifique a internet e atualize a página.");
            return;
        }

        const textoOriginal = botao.textContent;
        let copia = null;
        botao.disabled = true;
        botao.textContent = "GERANDO PDF...";

        try {
            const abordagens = numero("abordagens");
            const agenciados = numero("agenciados");
            const onboarding = numero("onboarding");
            const carteira = numero("carteiraAtiva");
            const gravAgendadas = numero("gravacoesAgendadas");
            const gravRealizadas = numero("gravacoesRealizadas");
            const gravCanceladas = numero("gravacoesCanceladas");
            const gravRemarcadas = numero("gravacoesRemarcadas");
            const pubPlanejadas = numero("publicacoesPlanejadas");
            const pubRealizadas = numero("publicacoesRealizadas");
            const solicitRecebidas = numero("solicitacoesRecebidas");
            const solicitResolvidas = numero("solicitacoesResolvidas");
            const pendAbertas = numero("pendenciasAbertas");
            const pendAntigas = numero("pendenciasAntigas");

            preencher("pdfDataInicio", dataBR(valor("dataInicio")));
            preencher("pdfDataFim", dataBR(valor("dataFim")));
            preencher("pdfDataEnvio", dataBR(valor("dataEnvio")));

            preencher("pdfAbordagens", formatarNumero(abordagens));
            preencher("pdfAgenciados", formatarNumero(agenciados));
            preencher("pdfGravacoesRealizadas", formatarNumero(gravRealizadas));
            preencher("pdfCarteiraAtiva", formatarNumero(carteira));
            preencher("pdfCarteiraAtiva2", formatarNumero(carteira));

            const resumo = [];
            if (abordagens !== null) resumo.push(`${formatarNumero(abordagens)} novos contatos`);
            if (agenciados !== null) resumo.push(`${formatarNumero(agenciados)} novos agenciados`);
            if (gravRealizadas !== null) resumo.push(`${formatarNumero(gravRealizadas)} gravações realizadas`);
            preencher("pdfResumoExecutivo", resumo.length ? resumo.join(" • ") + "." : "Não foram preenchidos indicadores numéricos para o período.");

            // Distribuição por modalidade: barras com escala comum.
            const modProducao = numero("modalidadeProducao");
            const modAgenciamento = numero("modalidadeAgenciamento");
            const modBoate = numero("modalidadeBoate");
            const modalidades = [modProducao, modAgenciamento, modBoate];
            const maxModalidade = Math.max(...modalidades.filter(n => n !== null), 0);
            preencherBarra("barraModalidadeProducao", "valorModalidadeProducao", modProducao, maxModalidade);
            preencherBarra("barraModalidadeAgenciamento", "valorModalidadeAgenciamento", modAgenciamento, maxModalidade);
            preencherBarra("barraModalidadeBoate", "valorModalidadeBoate", modBoate, maxModalidade);
            const pessoasUnicas = numero("pessoasModalidadesUnicas");
            preencher("notaModalidades", pessoasUnicas === null
                ? "As categorias podem se sobrepor; a soma das modalidades não representa necessariamente pessoas únicas."
                : `Pessoas únicas informadas: ${formatarNumero(pessoasUnicas)}. A mesma pessoa pode estar em mais de uma modalidade.`);

            // Agenda de gravações.
            const maxGrav = Math.max(...[gravAgendadas, gravRealizadas, gravCanceladas, gravRemarcadas].filter(n => n !== null), 0);
            preencherBarra("barraGravacoesAgendadas", "valorGravacoesAgendadas", gravAgendadas, maxGrav);
            preencherBarra("barraGravacoesRealizadas", "valorGravacoesRealizadas", gravRealizadas, maxGrav);
            preencherBarra("barraGravacoesCanceladas", "valorGravacoesCanceladas", gravCanceladas, maxGrav);
            preencherBarra("barraGravacoesRemarcadas", "valorGravacoesRemarcadas", gravRemarcadas, maxGrav);
            preencher("taxaConclusaoGravacoes", percentual(gravRealizadas, gravAgendadas));
            preencher("notaGravacoes", gravAgendadas === null || gravRealizadas === null
                ? "Preencha gravações agendadas e realizadas para calcular a taxa."
                : gravAgendadas === 0
                    ? "Não houve gravações agendadas; taxa não aplicável."
                    : "Cálculo: gravações realizadas ÷ gravações agendadas. Leia junto às remarcações e cancelamentos.");

            // Publicações: independem da semana em que o conteúdo foi gravado.
            preencher("pdfPublicacoesPlanejadas", formatarNumero(pubPlanejadas));
            preencher("pdfPublicacoesRealizadas", formatarNumero(pubRealizadas));
            preencher("taxaPublicacoes", percentual(pubRealizadas, pubPlanejadas));

            // Encaminhamentos e carteira.
            preencherCamposNumericos({
                encaminhamentosEnviados: "pdfEncaminhamentosEnviados",
                encaminhamentosRecebidos: "pdfEncaminhamentosRecebidos",
                encaminhamentosPendentes: "pdfEncaminhamentosPendentes",
                agenciadosPausados: "pdfAgenciadosPausados",
                agenciadosDesligados: "pdfAgenciadosDesligados",
                solicitacoesRecebidas: "pdfSolicitacoesRecebidas",
                solicitacoesResolvidas: "pdfSolicitacoesResolvidas",
                pendenciasAbertas: "pdfPendenciasAbertas",
                pendenciasAntigas: "pdfPendenciasAntigas",
                autorizacoesVerificadas: "pdfAutorizacoesVerificadas",
                autorizacoesPendentes: "pdfAutorizacoesPendentes",
                atividadesBloqueadas: "pdfAtividadesBloqueadas"
            });
            preencher("taxaResolucao", percentual(solicitResolvidas, solicitRecebidas));

            // Texto dos campos de acompanhamento.
            const textos = {
                statusOnboarding: "pdfStatusOnboarding",
                statusGravacoes: "pdfStatusGravacoes",
                observacaoPublicacoes: "pdfObservacaoPublicacoes",
                statusEncaminhamentos: "pdfStatusEncaminhamentos",
                detalhesPendencias: "pdfDetalhesPendencias",
                detalhesConformidade: "pdfDetalhesConformidade",
                destaques: "pdfDestaques",
                gargalos: "pdfGargalos",
                riscos: "pdfRiscos",
                decisoesTomadas: "pdfDecisoesTomadas",
                aprovacoes: "pdfAprovacoes",
                proximosPassos: "pdfProximosPassos"
            };
            Object.entries(textos).forEach(([origem, destino]) => {
                preencher(destino, textoOu(origem));
            });

            // Clona o template depois de preencher todos os campos e gráficos.
            copia = template.cloneNode(true);
            copia.removeAttribute("id");

            Object.assign(copia.style, {
                display: "block",
                position: "fixed",
                left: "0",
                top: "0",
                width: "794px",
                height: "auto",
                minHeight: "0",
                padding: "55px",
                margin: "0",
                boxSizing: "border-box",
                backgroundColor: "#ffffff",
                color: "#111111",
                zIndex: "999999",
                overflow: "visible"
            });

            document.body.appendChild(copia);
            await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));

            const canvas = await window.html2canvas(copia, {
                scale: 2,
                backgroundColor: "#ffffff",
                useCORS: true,
                logging: false,
                width: copia.scrollWidth,
                height: copia.scrollHeight,
                windowWidth: 794,
                scrollX: 0,
                scrollY: 0
            });

            if (!canvas.width || !canvas.height) throw new Error("A captura do relatório ficou vazia.");

            const ctx = canvas.getContext("2d");
            const amostra = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
            let pixelsVisiveis = 0;
            for (let i = 0; i < amostra.length; i += 4 * 400) {
                if (amostra[i] < 245 || amostra[i + 1] < 245 || amostra[i + 2] < 245) pixelsVisiveis++;
            }
            if (pixelsVisiveis === 0) throw new Error("A captura ficou inteiramente branca.");

            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF("p", "mm", "a4");
            const larguraPagina = 210;
            const alturaPagina = 297;
            const imagem = canvas.toDataURL("image/jpeg", 0.96);
            const alturaImagem = canvas.height * larguraPagina / canvas.width;

            // O relatório longo é dividido em páginas A4 pela altura da imagem.
            let deslocamento = 0;
            let pagina = 0;
            while (deslocamento < alturaImagem) {
                if (pagina > 0) pdf.addPage();
                pdf.addImage(imagem, "JPEG", 0, -deslocamento, larguraPagina, alturaImagem, undefined, "FAST");
                deslocamento += alturaPagina;
                pagina++;
            }

            const nome = `SHIFT_Relatorio_Semanal_${valor("dataInicio")}_${valor("dataFim")}.pdf`;
            pdf.save(nome);
            alert("PDF criado. Abra o arquivo baixado para conferir.");
        } catch (erro) {
            console.error("Erro na geração do PDF:", erro);
            alert("Falha ao gerar o PDF:\n" + erro.message);
        } finally {
            if (copia) copia.remove();
            botao.disabled = false;
            botao.textContent = textoOriginal;
        }
    });
});
