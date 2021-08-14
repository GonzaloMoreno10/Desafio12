const path = require("path");
const exphbs = require('express-handlebars');
const Handlebars = require('handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
//Inicializaciones
const express = require('express'),
app = express(),
http = require('http').Server(app),
io = require('socket.io')(http); 
const Producto = require("./models/Producto")
const Archivo = require("./models/Archivo");
let archivo = new Archivo("./src/datasource/productos.txt");

app.set('port',process.env.port ||3000);

app.set('views', path.join(__dirname, 'views'));

app.engine('.hbs', exphbs({  //Configuro handlebars
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    handlebars: allowInsecurePrototypeAccess(Handlebars)
}));

app.set('view engine', '.hbs');

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const publicPath = path.resolve(__dirname, '../public');
app.use(express.static(publicPath));


app.use("/api/productos", require("./controllers/productosController"));

//Listen

http.listen(app.get('port'), (req, res) => {
    console.log("Servidor escuchando en " + app.get('port'));
})

io.on("connection", async socket => {
    let productos = await archivo.getProductos();

    socket.on("productos", async (data) => {
        console.log("Me llego un mensaje y lo llevo al arreglo")
        let producto = new Producto(data.title,data.price,data.thumbnail);
        if(producto){
            await archivo.guardar(producto)
        }
        productos = await archivo.getProductos()
        io.emit('productos', productos);
    }); 

    //Emito los mensajes 
    socket.on('askProducts', (data) => {
        socket.emit('productos', productos);
      });
  
  });