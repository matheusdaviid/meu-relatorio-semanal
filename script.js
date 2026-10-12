
document.addEventListener("DOMContentLoaded", () => {
    const botao = document.getElementById("btnGerarPDF");
    const formulario = document.getElementById("relatorioForm");
    const template = document.getElementById("pdfTemplate");

    const valor = id => document.getElementById(id).value.trim();

    const preencher = (id, conteudo) => {
        document.getElementById(id).textContent = conteudo;
    };

    const dataBR = data => {
        if (!data) return "Não informado";
        const [ano, mes, dia] = data.split("-");
        return `${dia}/${mes}/${ano}`;
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
            // Preenche o relatório.
            preencher("pdfDataInicio", dataBR(valor("dataInicio")));
            preencher("pdfDataFim", dataBR(valor("dataFim")));
            preencher("pdfDataEnvio", dataBR(valor("dataEnvio")));

            preencher("pdfAbordagens", valor("abordagens") || "0");
            preencher("pdfAgenciados", valor("agenciados") || "0");
            preencher("pdfConversao", (valor("conversao") || "0") + "%");
            preencher("pdfOnboarding", valor("onboarding") || "0");

            preencher("pdfStatusOnboarding",
                valor("statusOnboarding") || "Nenhuma observação registrada.");
            preencher("pdfDestaques", valor("destaques") || "Não informado");
            preencher("pdfProducao",
                valor("producao") || "Nenhum registro de produção.");
            preencher("pdfGargalos", valor("gargalos") || "Não informado");
            preencher("pdfRiscos",
                valor("riscos") || "Nenhum risco identificado.");
            preencher("pdfAprovacoes", valor("aprovacoes") || "Não informado");
            preencher("pdfProximosPassos",
                valor("proximosPassos") || "Não informado");

            // Cria uma cópia independente do modelo.
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
                padding: "75px",
                margin: "0",
                boxSizing: "border-box",
                backgroundColor: "#ffffff",
                color: "#111111",
                zIndex: "999999",
                overflow: "visible"
            });

            document.body.appendChild(copia);

            // Aguarda a renderização do modelo.
            await new Promise(resolve =>
                requestAnimationFrame(() =>
                    requestAnimationFrame(resolve)
                )
            );

            // Captura diretamente o relatório como imagem.
            const canvas = await window.html2canvas(copia, {
                scale: 2,
                backgroundColor: "#ffffff",
                useCORS: true,
                logging: true,
                width: copia.scrollWidth,
                height: copia.scrollHeight,
                windowWidth: 794,
                scrollX: 0,
                scrollY: 0
            });

            console.log("Captura do relatório:", canvas.width, canvas.height);

            if (!canvas.width || !canvas.height) {
                throw new Error("A captura do relatório ficou vazia.");
            }

            // Confere se a captura contém conteúdo visual.
            const contexto = canvas.getContext("2d");
            const pixels = contexto.getImageData(
                0, 0, canvas.width, canvas.height
            ).data;

            let pixelsDiferentes = 0;
            const passo = 400;

            for (let i = 0; i < pixels.length; i += 4 * passo) {
                if (
                    pixels[i] < 245 ||
                    pixels[i + 1] < 245 ||
                    pixels[i + 2] < 245
                ) {
                    pixelsDiferentes++;
                }
            }

            console.log("Pontos visuais detectados:", pixelsDiferentes);

            if (pixelsDiferentes === 0) {
                throw new Error(
                    "A captura ficou inteiramente branca. " +
                    "O problema acontece antes de criar o PDF."
                );
            }

            // Monta o PDF A4 diretamente com jsPDF.
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF("p", "mm", "a4");

            const larguraPagina = 210;
            const alturaPagina = 297;
            const imagem = canvas.toDataURL("image/jpeg", 0.98);

            const alturaImagem =
                canvas.height * larguraPagina / canvas.width;

            let deslocamento = 0;
            let pagina = 0;

            while (deslocamento < alturaImagem) {
                if (pagina > 0) pdf.addPage();

                pdf.addImage(
                    imagem,
                    "JPEG",
                    0,
                    -deslocamento,
                    larguraPagina,
                    alturaImagem,
                    undefined,
                    "FAST"
                );

                deslocamento += alturaPagina;
                pagina++;
            }

            const nome =
                `SHIFT_Relatorio_Semanal_${valor("dataInicio")}_` +
                `${valor("dataFim")}.pdf`;

            // Salva o arquivo.
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
