import bcrypt from "bcrypt";
export const hashPassword = async ( password: string ) => {
    try{
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    }
    catch(error){
        throw new Error(error.message);
    }    
};

export const checkPassword = async ( enteredPassword: string, storedHash: string ) =>  await bcrypt.compare(enteredPassword, storedHash);