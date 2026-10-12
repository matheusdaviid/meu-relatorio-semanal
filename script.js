document.getElementById('btnGerarPDF').addEventListener('click', function() {
    // 1. Captura de todos os campos
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

    // Validação
    if(!dataInicio || !dataFim || !dataEnvio || !abordagens || !agenciados || !destaques || !gargalos || !aprovacoes || !proximosPassos) {
        alert("Por favor, preencha todos os campos obrigatórios (*) antes de gerar o PDF.");
        return;
    }

    // 2. Formatação de Data
    const formatarData = (dataString) => {
        if (!dataString) return '';
        const [ano, mes, dia] = dataString.split('-');
        return `${dia}/${mes}/${ano}`;
    };

    // 3. Preenche os dados no TEMPLATE
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

    // 4. CHAMA A IMPRESSÃO DO NAVEGADOR
    // O navegador vai abrir a tela de impressão. O usuário só precisa escolher "Salvar como PDF"
    window.print();

    // 5. Limpa o formulário após a janela de impressão fechar
    // Usamos um pequeno timeout para garantir que o navegador já processou o comando
    setTimeout(() => {
        document.getElementById('relatorioForm').reset();
        alert("Se o PDF não foi salvo automaticamente, escolha 'Salvar como PDF' na tela de impressão que acabou de abrir.");
    }, 1000);
});