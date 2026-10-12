
document.addEventListener("DOMContentLoaded", () => {
    const botao = document.getElementById("btnGerarPDF");
    const formulario = document.getElementById("relatorioForm");
    const template = document.getElementById("pdfTemplate");

    if (!botao || !formulario || !template) {
        console.error("SHIFT: formulário, botão ou template não encontrado.");
        return;
    }

    const obter = id => document.getElementById(id).value.trim();

    const definir = (id, valor) => {
        document.getElementById(id).textContent = valor;
    };

    const dataBR = valor => {
        if (!valor) return "Não informado";
        const [ano, mes, dia] = valor.split("-");
        return `${dia}/${mes}/${ano}`;
    };

    botao.addEventListener("click", async () => {
        if (!formulario.reportValidity()) return;

        if (typeof window.html2pdf !== "function") {
            alert(
                "A biblioteca de PDF não carregou. " +
                "Verifique a conexão com a internet e atualize a página."
            );
            return;
        }

        const textoOriginal = botao.textContent;
        botao.disabled = true;
        botao.textContent = "GERANDO PDF...";

        let janelaPDF = null;

        try {
            // 1. Preencher o template com os dados do formulário.
            definir("pdfDataInicio", dataBR(obter("dataInicio")));
            definir("pdfDataFim", dataBR(obter("dataFim")));
            definir("pdfDataEnvio", dataBR(obter("dataEnvio")));

            definir("pdfAbordagens", obter("abordagens") || "0");
            definir("pdfAgenciados", obter("agenciados") || "0");
            definir(
                "pdfConversao",
                obter("conversao") ? obter("conversao") + "%" : "0%"
            );
            definir("pdfOnboarding", obter("onboarding") || "0");

            definir(
                "pdfStatusOnboarding",
                obter("statusOnboarding") ||
                "Nenhuma observação registrada."
            );
            definir("pdfDestaques", obter("destaques") || "Não informado");
            definir(
                "pdfProducao",
                obter("producao") || "Nenhum registro de produção."
            );
            definir("pdfGargalos", obter("gargalos") || "Não informado");
            definir(
                "pdfRiscos",
                obter("riscos") || "Nenhum risco identificado."
            );
            definir("pdfAprovacoes", obter("aprovacoes") || "Não informado");
            definir(
                "pdfProximosPassos",
                obter("proximosPassos") || "Não informado"
            );

            // 2. Abrir uma janela temporária para renderizar o relatório.
            // A janela é aberta durante o clique para evitar bloqueio do navegador.
            janelaPDF = window.open("", "_blank");

            if (!janelaPDF) {
                throw new Error(
                    "O navegador bloqueou a janela temporária. " +
                    "Permita pop-ups para este site e tente novamente."
                );
            }

            janelaPDF.document.open();
            janelaPDF.document.write(`
                <!DOCTYPE html>
                <html lang="pt-BR">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Relatório SHIFT</title>
                    <style>
                        * { box-sizing: border-box; }
                        html, body {
                            margin: 0;
                            padding: 0;
                            background: #fff;
                            color: #111;
                            font-family: "Segoe UI", Arial, sans-serif;
                        }
                        body { padding: 20mm; }
                        .pdf-container {
                            display: block !important;
                            width: 100% !important;
                            min-height: 0 !important;
                            height: auto !important;
                            margin: 0 !important;
                            padding: 0 !important;
                            position: static !important;
                            background: #fff !important;
                            color: #111 !important;
                            overflow: visible !important;
                        }
                        .pdf-header {
                            display: flex;
                            justify-content: space-between;
                            align-items: flex-end;
                            gap: 15px;
                            border-bottom: 3px solid #090909;
                            padding-bottom: 10px;
                            margin-bottom: 25px;
                        }
                        .pdf-logo {
                            font-size: 28px;
                            font-weight: 300;
                            letter-spacing: 6px;
                            color: #090909;
                        }
                        .pdf-header-info { text-align: right; }
                        .pdf-header-info h1 {
                            font-size: 16px;
                            margin: 0 0 5px;
                            color: #710F27;
                        }
                        .pdf-header-info p { font-size: 11px; color: #555; }
                        .pdf-kpi-grid {
                            display: flex;
                            gap: 10px;
                            margin-bottom: 25px;
                        }
                        .kpi-card {
                            flex: 1;
                            min-width: 0;
                            border: 1px solid #ddd;
                            border-top: 4px solid #710F27;
                            padding: 12px 6px;
                            text-align: center;
                            background: #f9f9f9;
                        }
                        .kpi-card h4 {
                            margin: 0 0 8px;
                            font-size: 9px;
                            color: #555;
                        }
                        .kpi-number {
                            font-size: 21px;
                            font-weight: bold;
                            color: #090909;
                            margin: 0;
                        }
                        .pdf-section {
                            margin-bottom: 22px;
                            break-inside: auto;
                        }
                        .pdf-section h3 {
                            font-size: 12px;
                            color: #fff;
                            background: #090909;
                            padding: 8px 12px;
                            margin-bottom: 12px;
                            break-after: avoid;
                        }
                        .pdf-section p {
                            font-size: 12px;
                            line-height: 1.6;
                            white-space: pre-wrap;
                            overflow-wrap: anywhere;
                            color: #333;
                        }
                        .pdf-section p strong { color: #710F27; }
                        .pdf-signature-section {
                            margin-top: 40px;
                            margin-bottom: 25px;
                            text-align: center;
                            break-inside: avoid;
                        }
                        .signature-line {
                            width: 250px;
                            height: 1px;
                            background: #090909;
                            margin: 0 auto 10px;
                        }
                        .signature-info p {
                            margin: 0;
                            font-size: 12px;
                            color: #333;
                        }
                        .signature-name {
                            font-weight: bold;
                            font-size: 14px;
                            color: #090909;
                        }
                        .signature-role { font-size: 11px; color: #666; }
                        .pdf-footer {
                            margin-top: 25px;
                            border-top: 1px solid #ddd;
                            padding-top: 12px;
                            font-size: 10px;
                            color: #888;
                            text-align: center;
                        }
                        @page { size: A4; margin: 0; }
                    </style>
                </head>
                <body>
                    <div id="areaRelatorio"></div>
                </body>
                </html>
            `);
            janelaPDF.document.close();

            // 3. Copiar o template para a janela de exportação.
            const relatorio = janelaPDF.document.getElementById("areaRelatorio");
            const copia = janelaPDF.document.importNode(template, true);
            copia.removeAttribute("id");
            copia.style.setProperty("display", "block", "important");
            relatorio.appendChild(copia);

            // 4. Aguardar o navegador calcular dimensões e estilos.
            await new Promise(resolve =>
                janelaPDF.requestAnimationFrame(() =>
                    janelaPDF.requestAnimationFrame(resolve)
                )
            );

            await new Promise(resolve => setTimeout(resolve, 300));

            if (!relatorio.textContent.trim()) {
                throw new Error("O relatório está vazio na página temporária.");
            }

            const largura = relatorio.getBoundingClientRect().width;
            const altura = relatorio.getBoundingClientRect().height;

            console.log("SHIFT PDF - dimensões do relatório:", largura, altura);

            if (largura <= 0 || altura <= 0) {
                throw new Error("O relatório não tem dimensões válidas.");
            }

            const nome =
                `SHIFT_Relatorio_Semanal_${obter("dataInicio")}_` +
                `${obter("dataFim")}.pdf`;

            // 5. Gerar e baixar o PDF.
            await janelaPDF.html2pdf?.().catch(() => {});

            // A biblioteca precisa ser disponibilizada na janela principal.
            // html2pdf trabalha com o elemento da janela temporária.
            await window.html2pdf()
                .set({
                    margin: 0,
                    filename: nome,
                    image: { type: "jpeg", quality: 0.98 },
                    html2canvas: {
                        scale: 2,
                        backgroundColor: "#ffffff",
                        useCORS: true,
                        logging: true,
                        windowWidth: 794,
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
                        avoid: [".kpi-card", ".pdf-signature-section"]
                    }
                })
                .from(relatorio)
                .save();

            alert("PDF gerado. Confira seus downloads.");

        } catch (erro) {
            console.error("SHIFT PDF:", erro);
            alert("Falha ao gerar PDF:\n" + erro.message);
        } finally {
            if (janelaPDF && !janelaPDF.closed) {
                janelaPDF.close();
            }
            botao.disabled = false;
            botao.textContent = textoOriginal;
        }
    });
});
