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

    // 3. Preenche os dados no TEMPLATE original
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

    // 4. CLONAGEM: Pega o template, clona ele e coloca em um container visível
    const templateOriginal = document.getElementById('pdfTemplate');
    const clone = templateOriginal.cloneNode(true);
    
    // Cria um container temporário para o clone
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'fixed';
    tempContainer.style.top = '0';
    tempContainer.style.left = '0';
    tempContainer.style.zIndex = '-9999'; // Fica atrás de tudo, mas está "visível" pro navegador
    tempContainer.style.opacity = '0'; // Invisível para o usuário
    tempContainer.style.pointerEvents = 'none';
    tempContainer.appendChild(clone);
    
    // Adiciona o container temporário ao corpo da página
    document.body.appendChild(tempContainer);
    
    // Força a exibição do clone
    clone.style.display = 'block';

    // 5. Configurações do PDF
    const opcoes = {
        margin:       0,
        filename:     `SHIFT_Relatorio_Semanal_${formatarData(dataEnvio).replace(/\//g, '-')}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true, logging: false, scrollY: 0 },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // 6. Gera o PDF a partir do CLONE
    html2pdf().set(opcoes).from(clone).save().then(() => {
        // Sucesso! Remove o container temporário
        document.body.removeChild(tempContainer);
        document.getElementById('relatorioForm').reset();
        alert("Relatório SHIFT gerado com sucesso! O formulário foi limpo.");
    }).catch(err => {
        console.error("Erro ao gerar PDF: ", err);
        // Remove o container mesmo em caso de erro
        if (document.body.contains(tempContainer)) {
            document.body.removeChild(tempContainer);
        }
        alert("Ocorreu um erro ao gerar o PDF. Verifique o console.");
    });
});