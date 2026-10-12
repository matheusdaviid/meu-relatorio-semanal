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

    // Validação mínima
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

    // 3. Injeção de dados no Template do PDF
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

    // 4. Configurações do PDF
    const elemento = document.getElementById('pdfTemplate');
    
    // --- CORREÇÃO AQUI ---
    // Força o elemento a ficar visível e na posição correta na tela para a captura
    elemento.classList.remove('pdf-hidden');
    elemento.style.display = 'block';
    elemento.style.position = 'absolute';
    elemento.style.left = '0';
    elemento.style.top = '0';
    elemento.style.zIndex = '9999';
    elemento.style.opacity = '1';
    elemento.style.width = '210mm'; // Garante a largura A4
    // ---------------------

    const opcoes = {
        margin:       0,
        filename:     `SHIFT_Relatorio_Semanal_${formatarData(dataEnvio).replace(/\//g, '-')}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true, scrollY: 0 },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // 5. Geração e Download
    // Adicionamos um pequeno delay (setTimeout) para o navegador renderizar o layout antes de capturar
    setTimeout(() => {
        html2pdf().set(opcoes).from(elemento).save().then(() => {
            // Esconde o template novamente e reseta o estilo
            elemento.classList.add('pdf-hidden');
            elemento.style.cssText = ''; // Limpa os estilos inline que forçamos
            
            // Limpa o formulário
            document.getElementById('relatorioForm').reset();
            alert("Relatório SHIFT gerado com sucesso! O formulário foi limpo.");
        }).catch(err => {
            console.error("Erro ao gerar PDF: ", err);
            elemento.classList.add('pdf-hidden');
            elemento.style.cssText = ''; 
            alert("Ocorreu um erro ao gerar o PDF. Verifique o console (F12).");
        });
    }, 500); // 500ms de delay é suficiente para a renderização
});