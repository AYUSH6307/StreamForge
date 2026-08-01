import { useState } from "react";
import Navbar from "../components/Navbar";
import "../styles/CreateStream.css";

function CreateStream() {

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const handleCreate = (e) => {

        e.preventDefault();

        if (!title || !description) {
            alert("Please fill all fields.");
            return;
        }

        console.log({
            title,
            description
        });

        alert("Stream Created Successfully!");

    };

    return (
        <>
            <Navbar />

            <div className="create-container">

                <div className="create-card">

                    <h2>Create New Stream</h2>

                    <form onSubmit={handleCreate}>

                        <div className="mb-3">

                            <label className="form-label">
                                Stream Title
                            </label>

                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter Stream Title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />

                        </div>

                        <div className="mb-3">

                            <label className="form-label">
                                Description
                            </label>

                            <textarea
                                className="form-control"
                                rows="4"
                                placeholder="Enter Description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            ></textarea>

                        </div>

                        <button
                            className="btn btn-success w-100"
                            type="submit"
                        >
                            Create Stream
                        </button>

                    </form>

                </div>

            </div>

        </>
    );
}

export default CreateStream;