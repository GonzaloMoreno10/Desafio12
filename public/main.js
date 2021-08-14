const socket = io.connect('http://localhost:3000', { forceNew: true });

// Cuando arrancamos pedimos la data que hay actualmente enviando un socket
socket.emit('askProducts');


function sendData(e) {
    const title = document.getElementById('title').value;
    const price = document.getElementById('price').value;
    const thumbnail = document.getElementById('thumbnail').value;
    let objeto = {
        title: title,
        price: price,
        thumbnail: thumbnail
    }
    socket.emit('productos', objeto);
}

function render(data) {
    let cuerpo = document.getElementById('cuerpo');
    let newElement = document.createElement('tr');
    let htmlProducto = `
    <td>${data.title}</td>
    <td>${data.price}</td>
    <td>
      <div class='text-center wd-100'>
        <div
          class='card'
          style='width: 4rem; margin-left: auto; margin-right: auto;'
        >
          <img
            src='${data.thumbnail}'
            class='card-img-top mx-auto d-block'
            alt='...'
          />
        </div>
      </div>
    </td>
    `;
  newElement.innerHTML = htmlProducto;
  cuerpo.appendChild(newElement);
};

socket.on('productos', function (data) {
    document.getElementById('cuerpo').innerHTML = ""
    alert("Hay productos nuevos")
    for(let i in data){
        render(data[i]);
    }
    
});