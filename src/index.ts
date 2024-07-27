import server from "./server";
import colors from "colors";

const port = process.env.PORT || 4000
server.listen( port, () => {
    try{
        console.log(colors.blue.bold('Servidor en linea'));
    }
    catch( error ){
        console.log(colors.red.bold('Hubo un error'));
        console.error(error.message);
    }
});