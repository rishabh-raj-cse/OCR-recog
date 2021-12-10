import { useRouter } from "next/router";
import { useState } from "react";
import axios from "axios";
import { css } from "@emotion/react";
import ClipLoader from "react-spinners/PulseLoader";

// Can be a string as well. Need to ensure each key-value pair ends with ;
const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

function Upload() {
  const router = useRouter();
  const { id } = router.query;
  const { id2 } = router.query;
  const { id3 } = router.query;
  const { name } = router.query;
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [file2, setFile2] = useState(null);
  const [file3, setFile3] = useState(null);

  const uploadFile = async () => {
    setLoading(true);
    const ids = [id, id2, id3];
    const data = new FormData();
    data.append("file", file);
    data.append("file", file2);
    data.append("file", file3);
    data.append("name", name);
    // data.append("id1", id);
    // data.append("id2", id2);
    // data.append("id3", id3);




    for (var i = 0; i < ids.length; i++) {
      if (ids[i] !== null) {
        data.append("id[]", ids[i]);
        console.log(ids[i]);
      }
    }
    // data.append("id", JSON.stringify([id, id2, id3]));
    await axios
      .post("/api/ocr", data)
      .then((res) => {
        setLoading(false);
        // setMessage(
        //   res.data
        // );
        console.log(res);
      })
      .catch((err) => {
        setLoading(false);
        setMessage(err.message);
      });
  };
  return (
    <div className="flex items-center justify-center w-screen h-screen ">
      <div className="flex flex-col items-center justify-center bg-gray-100 p-20 rounded-xl">
        <h1 className="text-center font-bold text-4xl pb-6">
          {" "}
          Upload Emmirates ID{" "}
        </h1>
        <input
          type="file"
          name="file"
          id="file"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <h1 className="text-center font-bold text-4xl pb-6">
          {" "}
          Driving License{" "}
        </h1>
        <input
          type="file"
          name="file"
          id="file"
          onChange={(e) => setFile2(e.target.files[0])}
        />
        <h1 className="text-center font-bold text-4xl pb-6">
          {" "}
          Trade Id{" "}
        </h1>
        <input
          type="file"
          name="file"
          id="file"
          onChange={(e) => setFile3(e.target.files[0])}
        />
        <button
          className="bg-blue-500 p-2 mt-5 text-white rounded-xl w-32"
          onClick={uploadFile}
        >
          Upload
        </button>

        <p className="text-xl pt-5">{message}</p>

        <div className="p-5">
          <ClipLoader
            color={"black"}
            loading={loading}
            css={override}
            size={20}
          />
        </div>
      </div>
    </div>
  );
}

export default Upload;

