import React, { useEffect, useState } from "react";
import GoogleLogin from "react-google-login";
import axios from "axios";

export default function GoogleSide({ setFilesList, onRemove }) {
  const [photoUrl, setPhotoUrl] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("@googleAuth");
    const tokenId = localStorage.getItem("@googleAuthId");
    if (token && tokenId) {
      fetchProfileAndFiles(tokenId, token);
    }
  }, []);

  /* Google Success Response */
  const responseSuccessGoogle = (res) => {
    console.log(res);
    localStorage.setItem("@googleAuth", res.accessToken);
    localStorage.setItem("@googleAuthId", res.tokenId);
    fetchProfileAndFiles(res.tokenId, res.accessToken);
  };

  const fetchProfileAndFiles = (tokenId, accessToken) => {
    axios({
      method: "POST",
      url: "http://localhost:5000/google/login",
      data: { tokenId, accessToken },
    }).then((res) => {
      setPhotoUrl(res.data.user.picture);
      setFilesList(res.data.files);
    });
  };

  /* Google Fail Response */
  const responseFailureGoogle = (res) => {
    console.log("Fail");
    console.log(res);
  };

  /* When the Remove Button Pressed - From Child to Parent */
  const handleOnRemove = () => {
    setPhotoUrl("");
    onRemove();
  };

  return (
    <div className="google-card-wrapper">
      <h4>Google Profile to FaceBook</h4>
      <div style={{ display: photoUrl.length === 0 ? "block" : "none" }}>
        <div className="center google-btn">
          <GoogleLogin
            clientId="365796586806-r5db3q6njc93nkaktqi44cd7c3b1o98j.apps.googleusercontent.com"
            buttonText="Sign in with Google"
            onSuccess={responseSuccessGoogle}
            onFailure={responseFailureGoogle}
            cookiePolicy={"single_host_origin"}
            theme="dark"
            scope="https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.appdata https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.metadata https://www.googleapis.com/auth/drive.readonly"
          />
        </div>
      </div>

      <div style={{ display: photoUrl.length > 0 ? "block" : "none" }}>
        <Photo url={photoUrl} onRemove={handleOnRemove} />
      </div>
    </div>
  );
}

export function Photo({ url, onRemove }) {
  const handleOnSubmit = () => {};

  /* Parent Call the Child Function When Press the Remove Button */
  const handleOnRemove = () => {
    onRemove();
  };

  return (
    <div>
      <div className="center">
        <div>
          <img className="img" alt="My Profile" src={`${url}`} />
        </div>
      </div>
      <div className="center" style={{ justifyContent: "space-between" }}>
        <button className="remove-btn" onClick={handleOnRemove}>
          {" "}
          Remove{" "}
        </button>
        <button className="facebook-btn" onClick={handleOnSubmit}>
          {" "}
          Upload Profile{" "}
        </button>
      </div>
    </div>
  );
}
