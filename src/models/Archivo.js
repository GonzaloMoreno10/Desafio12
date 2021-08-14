const fs = require("fs/promises");
const { setFlagsFromString } = require("v8");

//Clase archivo
class Archivo {
    //Constructor
    constructor(name) {
        this.name = name;
    };

    //Metodo para leer la info del archivo productos.txt
    async getProductos() {
        let array = [];
        try {
            let data = await fs.readFile(this.name, "utf-8")
            array = data.split("\n");
            let array2 = array.filter(data => data != "");
            if (array2.length > 0) {
                let productos = array2.map(data => JSON.parse(data))
                return productos;
            }
            else {
                return array2
            }
        }
        catch (err) {
            console.log("Ocurrio un error " + err)
        }
    };

    getProductosById = async (id) => {
        let array = [];
        try {
            let data = await this.getProductos();
            if (data) {
                for (let i in data) {
                    if (data[i].id == id) {
                        return data[i];
                    }
                }
            }
            return null;
        } catch (error) {
            console.log("Error: " + error);
        }
    }

    //Metodo utilizado para guardar un objeto producto
    async guardar(producto) {
        let id = await this.generarId();
        let productos = await this.getProductos();
        if (productos) {
            producto.id = id;
            if (producto.title) {
                try {
                    await fs.appendFile(this.name, "\n" + JSON.stringify(producto));
                    return 1
                }
                catch (err) {
                    console.log("Ocurrio un error " + err)
                }
            }
        }
        else {
            await fs.writeFile(this.name, JSON.stringify(producto))
        }


    };

    //Metodo utilizado para generar el id
    async generarId() {
        let array = []
        let data = await fs.readFile(this.name, "utf-8");
        array = data.split("\n");
        return array.length;

    };

    //Metodo utilizado para borrar el archivo
    async borrar(id) {
        let indice = 0;
        try {
            let productos = await this.getProductos();
            for (let i in productos) {
                if (productos[i].id == id) {
                    productos.splice(i, 1)
                    await fs.unlink(this.name);
                    await fs.writeFile(this.name, "");
                    for (let i in productos) {
                        await this.guardar(productos[i])
                    }
                }
            };
        }
        catch (err) {
            throw err;
        }

    };


    async actualizar(id, producto) {
        let actualizada = 0;
        try {
            let productos = await this.getProductos();
            if (productos) {
                for (let i in productos) {
                    if (productos[i].id == id) {
                        productos[i].title = producto.title;
                        productos[i].price = producto.price;
                        productos[i].thumbnail = producto.thumbnail;
                        actualizada = 1;
                        break;
                    }
                }
                if (actualizada == 1) {
                    await fs.unlink(this.name);
                    await fs.writeFile(this.name, "");
                    for (let i in productos) {
                        await this.guardar(productos[i])
                    }
                    return await this.getProductosById(id);
                }
            }
        }
        catch (err) {
            throw err;
        }
    };
}

module.exports = Archivo;