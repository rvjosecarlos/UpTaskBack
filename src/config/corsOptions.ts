import { CorsOptions } from "cors";
import colors from "colors";

const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
        const whiteList = [process.env.FRONTEND_URL];
        const argumentosNode = process.argv;
        if( whiteList.includes(origin)){
            console.log('Entra en la lista blanca', whiteList);
            callback(null, true);
        }
        else{
            console.log('No se permite la entrada', whiteList);
            console.log(colors.red.bold('Error de CORS ' + origin));
            callback(new Error('Error de CORS'));
        }
    }
};

export { corsOptions  };
