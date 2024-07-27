import { CorsOptions } from "cors";
import colors from "colors";

const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
        const whiteList = [process.env.FRONTEND_URL];
        const argumentosNode = process.argv;
        if( whiteList.includes(origin) || argumentosNode[2] === undefined ){
            callback(null, true);
        }
        else{
            console.log(colors.red.bold('Error de CORS ' + origin));
            callback(new Error('Error de CORS'));
        }
    }
};

export { corsOptions  };