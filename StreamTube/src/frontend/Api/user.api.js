import { api } from "../api.js";

export const loginUser=async(data)=>{
    try {
        const response = await api.post('/users/login',data)
        console.log("user : ",response)
        return response.data;
    } catch (error) {
        console.log(error)
        throw error.response?.data || error
    }
};

export const registerUser=async(data)=>{
    try {
        
        const formData = new FormData();

        formData.append('fullname',data.fullname);
        formData.append('email',data.email);
        formData.append('username',data.username);
        formData.append('password',data.password);

        if(data.avatar){
            formData.append('avatar',data.avatar);
        }

        if(data.coverImage){
           formData.append('coverImage',data.coverImage)
        }
        
        const response = await api.post('/users/register',formData,{
        
            headers :{
                'Content-Type' : 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.log("Registration error : ",e)
    }
}


