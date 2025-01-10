// Função para calcular os resultados
document.getElementById("calculate-btn").addEventListener("click", () => {
  const priceSingle = parseFloat(document.getElementById("price-single").value) || 0;
  const priceDouble = parseFloat(document.getElementById("price-double").value) || 0;
  const priceTriple = parseFloat(document.getElementById("price-triple").value) || 0;
  const issTax = parseFloat(document.getElementById("iss-tax").value) / 100 || 0;

  const singleRooms = parseInt(document.getElementById("single").value) || 0;
  const doubleRooms = parseInt(document.getElementById("double").value) || 0;
  const tripleRooms = parseInt(document.getElementById("triple").value) || 0;
  const nights = parseInt(document.getElementById("nights").value) || 1;

  const totalSingle = singleRooms * priceSingle;
  const totalDouble = doubleRooms * priceDouble;
  const totalTriple = tripleRooms * priceTriple;
  const dailyTotal = totalSingle + totalDouble + totalTriple;
  const totalStay = dailyTotal * nights;
  const taxISS = totalStay * issTax;
  const grandTotal = totalStay + taxISS;

  const resultsBody = document.getElementById("results-body");
  resultsBody.innerHTML = `
    <tr>
      <td>Single</td>
      <td>${singleRooms}</td>
      <td>${singleRooms}</td>
      <td>R$ ${priceSingle.toFixed(2)}</td>
      <td>R$ ${totalSingle.toFixed(2)}</td>
    </tr>
    <tr>
      <td>Double</td>
      <td>${doubleRooms}</td>
      <td>${doubleRooms * 2}</td>
      <td>R$ ${priceDouble.toFixed(2)}</td>
      <td>R$ ${totalDouble.toFixed(2)}</td>
    </tr>
    <tr>
      <td>Triple</td>
      <td>${tripleRooms}</td>
      <td>${tripleRooms * 3}</td>
      <td>R$ ${priceTriple.toFixed(2)}</td>
      <td>R$ ${totalTriple.toFixed(2)}</td>
    </tr>
  `;

  const summary = document.getElementById("summary");
  summary.innerHTML = `
    <p><strong>Subtotal (diária):</strong> R$ ${dailyTotal.toFixed(2)}</p>
    <p><strong>Subtotal (${nights} noites):</strong> R$ ${totalStay.toFixed(2)}</p>
    <p><strong>ISS (${(issTax * 100).toFixed(2)}%):</strong> R$ ${taxISS.toFixed(2)}</p>
    <p><strong>Total Geral:</strong> R$ ${grandTotal.toFixed(2)}</p>
  `;
});

// Função para salvar o PDF com cabeçalho e rodapé
document.getElementById("save-pdf-btn").addEventListener("click", async () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  try {
      // Carregar as imagens
      const headerImg = await loadImage("header.png");
      const footerImg = await loadImage("footer.png");

      // Adicionar cabeçalho
      doc.addImage(headerImg, "PNG", 0, 0, 210, 20); // Ajuste de largura/altura

      // Adicionar data no canto inferior direito do cabeçalho
      const currentDate = formatDate(new Date()); // Função que formata a data
      doc.setTextColor(169, 169, 169); // Definir cor cinza claro
      doc.setFontSize(10);
      doc.text(currentDate, 165, 18); // Posição do texto no canto inferior direito

      // Adicionar título centralizado, maior e em negrito
      doc.setTextColor(35, 51, 67); // Cor #233343 para o texto principal
      doc.setFont("helvetica", "bold"); // Estilo de fonte em negrito
      doc.setFontSize(24); // Fonte maior
      doc.text("Proposta Comercial", 105, 45, { align: "center" }); // Mais para cima (y = 45)

      // Adicionar tabela
      const headers = ["Tipo", "Quantidade", "Capacidade", "Diária", "Total"];
      const data = [];
      document.querySelectorAll("#results-body tr").forEach((row) => {
          const cols = row.querySelectorAll("td");
          data.push(Array.from(cols).map((col) => col.textContent));
      });

      doc.autoTable({
          head: [headers],
          body: data,
          startY: 60,
      });

      // Adicionar resumo
      const summary = document.getElementById("summary").innerText.split("\n");
      let y = doc.lastAutoTable.finalY + 10;
      summary.forEach((line) => {
          doc.text(line, 10, y);
          y += 10;
      });

      // Adicionar rodapé
      doc.addImage(footerImg, "PNG", 0, 285, 210, 20); // Ajuste conforme necessário

      // Salvar PDF
      doc.save("proposta-comercial.pdf");
  } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      alert("Erro ao gerar o PDF. Verifique as imagens e tente novamente.");
  }
});

// Função para carregar imagem
function loadImage(url) {
  return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => {
          console.error(`Erro ao carregar a imagem: ${url}`);
          reject(new Error(`Imagem não encontrada ou inacessível: ${url}`));
      };
      img.src = url;
  });
}


// Função para formatar a data no formato "22 de novembro de 2024"
function formatDate(date) {
  const months = [
      "janeiro", "fevereiro", "março", "abril", "maio", "junho", 
      "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"
  ];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${day} de ${month} de ${year}`;
}