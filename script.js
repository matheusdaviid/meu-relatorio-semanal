document.getElementById('btnGerarPDF').addEventListener('click', function() {
    const dataInicio = document.getElementById('dataInicio').value;
    const dataFim = document.getElementById('dataFim').value;
    const dataEnvio = document.getElementById('dataEnvio').value;
    const abordagens = document.getElementById('abordagens').value;
    const agenciados = document.getElementById('agenciados').value;
    const conversao = document.getElementById('conversao').value;
    const onboarding = document.getElementById('onboarding').value;
    const statusOnboarding = document.getElementById('statusOnboarding').value;
    const destaques = document.getElementById('destaques').value;
    const producao = document.getElementById('producao').value;
    const gargalos = document.getElementById('gargalos').value;
    const riscos = document.getElementById('riscos').value;
    const aprovacoes = document.getElementById('aprovacoes').value;
    const proximosPassos = document.getElementById('proximosPassos').value;

    if(!dataInicio || !dataFim || !dataEnvio || !abordagens || !agenciados || !destaques || !gargalos || !aprovacoes || !proximosPassos) {
        alert("Por favor, preencha todos os campos obrigatórios (*) antes de gerar o PDF.");
        return;
    }

    const formatarData = (dataString) => {
        if (!dataString) return '';
        const [ano, mes, dia] = dataString.split('-');
        return `${dia}/${mes}/${ano}`;
    };

    document.getElementById('pdfDataInicio').innerText = formatarData(dataInicio);
    document.getElementById('pdfDataFim').innerText = formatarData(dataFim);
    document.getElementById('pdfDataEnvio').innerText = formatarData(dataEnvio);
    document.getElementById('pdfAbordagens').innerText = abordagens;
    document.getElementById('pdfAgenciados').innerText = agenciados;
    document.getElementById('pdfConversao').innerText = conversao ? `${conversao}%` : '0%';
    document.getElementById('pdfOnboarding').innerText = onboarding || '0';
    document.getElementById('pdfStatusOnboarding').innerText = statusOnboarding || "Nenhuma observação registrada.";
    document.getElementById('pdfDestaques').innerText = destaques;
    document.getElementById('pdfProducao').innerText = producao || "Nenhum registro de produção.";
    document.getElementById('pdfGargalos').innerText = gargalos;
    document.getElementById('pdfRiscos').innerText = riscos || "Nenhum risco identificado.";
    document.getElementById('pdfAprovacoes').innerText = aprovacoes;
    document.getElementById('pdfProximosPassos').innerText = proximosPassos;

    const elemento = document.getElementById('pdfTemplate');
    elemento.style.display = 'block';

    const opcoes = {
        margin: 0,
        filename: `SHIFT_Relatorio_Semanal_${formatarData(dataEnvio).replace(/\//g, '-')}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, scrollY: 0 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opcoes).from(elemento).save().then(() => {
        elemento.style.display = 'none';
        document.getElementById('relatorioForm').reset();
        alert("Relatório SHIFT gerado com sucesso! O formulário foi limpo.");
    }).catch(err => {
        console.error("Erro ao gerar PDF: ", err);
        elemento.style.display = 'none';
        alert("Ocorreu um erro ao gerar o PDF. Verifique o console (F12).");
    });
});