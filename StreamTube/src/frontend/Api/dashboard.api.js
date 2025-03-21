import { api } from "../api"


export const getUserDashboard=async()=>{
   try {
     const response= await api.get("/dashboard/stats");
     console.log("dashboard : ",response);
     return response;
   } catch (error) {
    console.log("dashboard error : ",error)
   }

}


export const logoutUser=async()=>{
  try {
     const response = await api.post("/users/logout")
     console.log("logout user : ",response)
  } catch (error) {
     console.log("logout error : ",error)
  }
}
