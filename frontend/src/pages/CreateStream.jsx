import { useState } from "react";


function CreateStream(){

    const [streamName, setStreamName] = useState("");
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");


    function handleSubmit(){

    if(
        streamName === "" ||
        category === "" ||
        description === ""
    ){

        alert("Please fill all fields");

        return;

    }


    alert("Stream Created Successfully!");

    console.log(streamName);
    console.log(category);
    console.log(description);

}


    return(

        <div className="container mt-5">

            <div className="card shadow p-4">

                <h2 className="fw-bold mb-4">
                    Create New Stream
                </h2>


                <label className="mb-2">
                    Stream Name
                </label>

                <input 
                    type="text"
                    className="form-control mb-3"
                    placeholder="Enter stream name"
                    value={streamName}
                    onChange={(e)=>setStreamName(e.target.value)}
                />


                <label className="mb-2">
                    Category
                </label>

                <input 
                    type="text"
                    className="form-control mb-3"
                    placeholder="Enter category"
                    value={category}
                    onChange={(e)=>setCategory(e.target.value)}
                />


                <label className="mb-2">
                    Description
                </label>

                <textarea
                    className="form-control mb-3"
                    placeholder="Enter description"
                    value={description}
                    onChange={(e)=>setDescription(e.target.value)}
                />


                <button 
                    className="btn btn-primary"
                    onClick={handleSubmit}
                >
                    Create Stream 🚀
                </button>


            </div>

        </div>

    )

}


export default CreateStream;