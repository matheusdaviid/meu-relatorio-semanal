
document.addEventListener("DOMContentLoaded", function () {
    const botao = document.getElementById("btnGerarPDF");
    const formulario = document.getElementById("relatorioForm");
    const template = document.getElementById("pdfTemplate");

    const campos = {
        dataInicio: "pdfDataInicio",
        dataFim: "pdfDataFim",
        dataEnvio: "pdfDataEnvio",
        abordagens: "pdfAbordagens",
        agenciados: "pdfAgenciados",
        onboarding: "pdfOnboarding",
        statusOnboarding: "pdfStatusOnboarding",
        destaques: "pdfDestaques",
        producao: "pdfProducao",
        gargalos: "pdfGargalos",
        riscos: "pdfRiscos",
        aprovacoes: "pdfAprovacoes",
        proximosPassos: "pdfProximosPassos"
    };

    function formatarData(valor) {
        if (!valor) return "Não informado";

        const [ano, mes, dia] = valor.split("-");
        return `${dia}/${mes}/${ano}`;
    }

    function obterValor(id) {
        return document.getElementById(id).value.trim();
    }

    function preencherTexto(id, valorPadrao = "Não informado") {
        const elemento = document.getElementById(id);
        elemento.textContent = valorPadrao;
    }

    botao.addEventListener("click", async function () {
        // Impede cliques repetidos durante a geração.
        if (botao.disabled) return;

        // Valida todos os campos marcados como obrigatórios no HTML.
        if (!formulario.reportValidity()) return;

        // Confirma se a biblioteca de PDF foi carregada.
        if (typeof html2pdf === "undefined") {
            alert(
                "A biblioteca de PDF não foi carregada. " +
                "Verifique sua conexão com a internet e recarregue a página."
            );
            return;
        }

        botao.disabled = true;
        const textoOriginal = botao.textContent;
        botao.textContent = "GERANDO PDF...";

        try {
            // Copia as informações preenchidas para o template.
            document.getElementById("pdfDataInicio").textContent =
                formatarData(obterValor("dataInicio"));

            document.getElementById("pdfDataFim").textContent =
                formatarData(obterValor("dataFim"));

            document.getElementById("pdfDataEnvio").textContent =
                formatarData(obterValor("dataEnvio"));

            document.getElementById("pdfAbordagens").textContent =
                obterValor("abordagens") || "0";

            document.getElementById("pdfAgenciados").textContent =
                obterValor("agenciados") || "0";

            const conversao = obterValor("conversao");
            document.getElementById("pdfConversao").textContent =
                conversao ? `${conversao}%` : "0%";

            document.getElementById("pdfOnboarding").textContent =
                obterValor("onboarding") || "0";

            document.getElementById("pdfStatusOnboarding").textContent =
                obterValor("statusOnboarding") ||
                "Nenhuma observação registrada.";

            document.getElementById("pdfDestaques").textContent =
                obterValor("destaques") || "Não informado";

            document.getElementById("pdfProducao").textContent =
                obterValor("producao") ||
                "Nenhum registro de produção.";

            document.getElementById("pdfGargalos").textContent =
                obterValor("gargalos") || "Não informado";

            document.getElementById("pdfRiscos").textContent =
                obterValor("riscos") || "Nenhum risco identificado.";

            document.getElementById("pdfAprovacoes").textContent =
                obterValor("aprovacoes") || "Não informado";

            document.getElementById("pdfProximosPassos").textContent =
                obterValor("proximosPassos") || "Não informado";

            // Cria uma cópia independente do template para exportação.
            const copiaPDF = template.cloneNode(true);
            copiaPDF.id = "pdfTemplateExportacao";

            // Torna a cópia renderizável, sem alterar o formulário.
            copiaPDF.style.setProperty("display", "block", "important");
            copiaPDF.style.setProperty("position", "absolute");
            copiaPDF.style.setProperty("left", "-10000px");
            copiaPDF.style.setProperty("top", "0");
            copiaPDF.style.setProperty("width", "210mm");
            copiaPDF.style.setProperty("min-height", "297mm");
            copiaPDF.style.setProperty("height", "auto");
            copiaPDF.style.setProperty("padding", "20mm");
            copiaPDF.style.setProperty("margin", "0");
            copiaPDF.style.setProperty("box-sizing", "border-box");
            copiaPDF.style.setProperty("background", "#ffffff");
            copiaPDF.style.setProperty("color", "#111111");
            copiaPDF.style.setProperty("overflow", "visible");

            document.body.appendChild(copiaPDF);

            // Espera o navegador calcular os estilos antes de capturar.
            await new Promise(resolve =>
                requestAnimationFrame(() =>
                    requestAnimationFrame(resolve)
                )
            );

            const nomeArquivo =
                `SHIFT_Relatorio_Semanal_` +
                `${obterValor("dataInicio") || "inicio"}_` +
                `${obterValor("dataFim") || "fim"}.pdf`;

            const opcoes = {
                margin: 0,
                filename: nomeArquivo,
                image: {
                    type: "jpeg",
                    quality: 0.98
                },
                html2canvas: {
                    scale: 2,
                    useCORS: true,
                    backgroundColor: "#ffffff",
                    scrollX: 0,
                    scrollY: 0
                },
                jsPDF: {
                    unit: "mm",
                    format: "a4",
                    orientation: "portrait"
                },
                pagebreak: {
                    mode: ["css", "legacy"],
                    avoid: [".kpi-card", ".pdf-section",
                            ".pdf-signature-section"]
                }
            };

            await html2pdf()
                .set(opcoes)
                .from(copiaPDF)
                .save();

            // O formulário permanece preenchido após o download.
            alert("PDF gerado! Confira seus downloads.");

            copiaPDF.remove();

        } catch (erro) {
            console.error("Erro ao gerar o PDF:", erro);

            alert(
                "Não foi possível gerar o PDF. " +
                "Tente novamente com uma conexão estável. " +
                "Se o erro continuar, abra o Console do navegador " +
                "para verificar os detalhes."
            );

            const copiaAntiga =
                document.getElementById("pdfTemplateExportacao");

            if (copiaAntiga) copiaAntiga.remove();

        } finally {
            botao.disabled = false;
            botao.textContent = textoOriginal;
        }
    });
});
