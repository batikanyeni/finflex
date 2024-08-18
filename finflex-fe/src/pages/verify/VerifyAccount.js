import {useSearchParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";

function VerifyAccount() {
    const [searchParams] = useSearchParams();
    const [message, setMessage] = useState('');

    useEffect(() => {
        const token = searchParams.get('token');
        if (token) {
            axios.put(`http://localhost:8080/api/v1/tokens/verify-mail?token=${token}`)
                .then(res => {
                    if(res.status === 200) {
                        setMessage(res.data)
                    }
                })
                .catch(err => {
                    if (err.code === 'ERR_NETWORK') {
                        setMessage(err.message)
                    } else if(err.response.data.code === 1009 || err.response.data.code === 1006 || err.response.data.code === 1007 || err.response.data.code === 1010){
                        setMessage(err.response.data.message)
                    }
                });
        } else {
            setMessage('Token bulunamadı.');
        }
    }, [searchParams]);

    return (
      <div style={{
          maxWidth: "450px",
          margin: "50px auto auto auto",
          textAlign: "center",
          backgroundColor: 'white',
          borderRadius: '4px',
          padding: '40px 20px 40px 20px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19)'
      }}>
          {message === 'Kullanıcı başarıyla doğrulandı.' ? (
              <>
                  <img src="success.png" width={100} alt="success"/>
                  <h2 style={{
                      color: 'limegreen',
                      fontSize: '28px',
                      fontWeight: 'normal'
                  }}>
                      Doğrulama Başarılı
                  </h2>
                  <p style={{marginBottom: '30px'}}>{message}</p>
                  <a href="/" style={{
                      backgroundColor: 'limegreen',
                      color: 'white',
                      fontWeight: 'bold',
                      display: 'inline-block',
                      padding: '10px',
                      borderRadius: '3px',
                      textDecoration: 'none'
                  }}>
                      Giriş Yap
                  </a>
              </>
          ): (
              <>
                  <img src="fail.png" width={100} alt="fail"/>
                  <h2 style={{
                      color: 'red',
                      fontSize: '28px',
                      fontWeight: 'normal'
                  }}>
                      Doğrulama Başarısız
                  </h2>
                  <p style={{marginBottom: '30px'}}>{message}</p>
                  <a href="/" style={{
                      backgroundColor: 'red',
                      color: 'white',
                      fontWeight: 'bold',
                      display: 'inline-block',
                      padding: '10px',
                      borderRadius: '3px',
                      textDecoration: 'none'
                  }}>
                      Kayıt Ol
                  </a>
              </>
          )}
      </div>
    );
}

export default VerifyAccount;