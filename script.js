
document.addEventListener("DOMContentLoaded", function () {
    const botao = document.getElementById("btnGerarPDF");
    const formulario = document.getElementById("relatorioForm");
    const template = document.getElementById("pdfTemplate");

    function valor(id) {
        return document.getElementById(id).value.trim();
    }

    function texto(id, conteudo) {
        document.getElementById(id).textContent = conteudo;
    }

    function formatarData(data) {
        if (!data) return "Não informado";
        const [ano, mes, dia] = data.split("-");
        return `${dia}/${mes}/${ano}`;
    }

    botao.addEventListener("click", async function () {
        if (!formulario.reportValidity()) return;

        if (typeof html2pdf === "undefined") {
            alert(
                "A biblioteca PDF não carregou. Verifique sua internet, " +
                "recarregue a página e tente novamente."
            );
            return;
        }

        botao.disabled = true;
        const textoOriginal = botao.textContent;
        botao.textContent = "GERANDO PDF...";

        let copiaPDF = null;

        try {
            // Preenche o relatório com os dados digitados.
            texto("pdfDataInicio", formatarData(valor("dataInicio")));
            texto("pdfDataFim", formatarData(valor("dataFim")));
            texto("pdfDataEnvio", formatarData(valor("dataEnvio")));

            texto("pdfAbordagens", valor("abordagens") || "0");
            texto("pdfAgenciados", valor("agenciados") || "0");
            texto(
                "pdfConversao",
                valor("conversao") ? valor("conversao") + "%" : "0%"
            );
            texto("pdfOnboarding", valor("onboarding") || "0");

            texto(
                "pdfStatusOnboarding",
                valor("statusOnboarding") ||
                "Nenhuma observação registrada."
            );
            texto("pdfDestaques", valor("destaques") || "Não informado");
            texto(
                "pdfProducao",
                valor("producao") || "Nenhum registro de produção."
            );
            texto("pdfGargalos", valor("gargalos") || "Não informado");
            texto(
                "pdfRiscos",
                valor("riscos") || "Nenhum risco identificado."
            );
            texto("pdfAprovacoes", valor("aprovacoes") || "Não informado");
            texto(
                "pdfProximosPassos",
                valor("proximosPassos") || "Não informado"
            );

            // Remove uma cópia antiga, caso tenha sobrado de uma tentativa.
            const antiga = document.getElementById("pdfTemplateExportacao");
            if (antiga) antiga.remove();

            // Cria uma cópia independente do relatório.
            copiaPDF = template.cloneNode(true);
            copiaPDF.id = "pdfTemplateExportacao";

            // Coloca a cópia dentro da área visível do navegador.
            Object.assign(copiaPDF.style, {
                display: "block",
                position: "fixed",
                left: "0",
                top: "0",
                width: "794px",
                minHeight: "1123px",
                height: "auto",
                padding: "75px",
                margin: "0",
                boxSizing: "border-box",
                background: "#ffffff",
                color: "#111111",
                overflow: "visible",
                zIndex: "99999"
            });

            // Garante que os estilos do relatório sejam aplicados.
            copiaPDF.querySelectorAll("*").forEach(function (el) {
                el.style.visibility = "visible";
            });

            document.body.appendChild(copiaPDF);

            // Aguarda a renderização do navegador.
            await new Promise(resolve => requestAnimationFrame(() =>
                requestAnimationFrame(resolve)
            ));

            if (copiaPDF.getBoundingClientRect().width === 0) {
                throw new Error("O relatório não está sendo renderizado.");
            }

            const nomeArquivo =
                "SHIFT_Relatorio_Semanal_" +
                valor("dataInicio") + "_" +
                valor("dataFim") + ".pdf";

            // Gera o PDF diretamente, sem abrir a janela de impressão.
            await html2pdf()
                .set({
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
                        logging: true,
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
                        avoid: [
                            ".kpi-card",
                            ".pdf-section",
                            ".pdf-signature-section"
                        ]
                    }
                })
                .from(copiaPDF)
                .save();

            alert("PDF gerado! Confira seus downloads.");

        } catch (erro) {
            console.error("Erro ao gerar PDF:", erro);

            alert(
                "Não foi possível gerar o PDF. " +
                "Abra o Console do navegador (F12) e confira o erro."
            );

        } finally {
            if (copiaPDF) copiaPDF.remove();

            botao.disabled = false;
            botao.textContent = textoOriginal;
        }
    });
});
