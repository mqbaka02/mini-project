import { clearLocaltDatas } from "../logout/page";
import { BASE_API_URL } from "../register/page";

export const _fetch: (path: string, params: any)=> Promise<Response>= async (path: string, params: any)=> {
    const res= await fetch(path, {
        ...params,
        headers: { 'Content-type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('accessToken') + ' ' + localStorage.getItem('refreshToken') },
    });
    const oldToken= localStorage.getItem("accessToken");
    if ((res.status=== 401)|| (res.status=== 403)) {
        //Access is invalid
        const data= await res.json();
        let newRes: Response;
        if (data.error!== "accessToken") {
            throw new Error("Unknown error happened.");
        } else {
            const response= await fetch(BASE_API_URL + '/refresh', {
                method: 'POST',
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify({
                    refreshToken: localStorage.getItem('refreshToken')
                })
            });
            // console.log("HERE=>", response);
            if (!response.ok) {
                //Refresh token failed.
                //Redirect to login.
                clearLocaltDatas();
                window.location.href= "/login";
                return response;
            }
            const data2= await response.json();
            // console.log(data2);
            localStorage.setItem("accessToken", data2.accessToken);
            localStorage.setItem("refreshToken", data2.refreshToken);
            newRes=  await fetch(path, {
                ...params,
                headers: { 'Content-type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('accessToken') + ' ' + localStorage.getItem('refreshToken') },
            });
            // console.log("THE mistaque", JSON.parse(JSON.stringify(newRes)));
            return newRes;
        }
        //Call refresh and redo the fetch with the new creadentials
    } else {
        return res;
    }
}