import { config } from './Constants'  
import axios from "axios"  


export const documentUpload = (file) => {
    let formData = new FormData()  
    formData.append("file", file)  
    axios
        .post('http://' + config.url.API_URL +
            `/api/msp/document/${file.name}/`,
            formData,
            {
                headers: {
                    'content-type': 'multipart/form-data',
                }
            })

        .then(res => {
            console.log('Successfully file upload', res)  
        })
        .catch(err => {
            console.error(err.data)  
        })  
}  
