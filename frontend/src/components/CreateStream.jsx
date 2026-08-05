import { useState } from "react";
import { createStream } from "../services/streamService";

function CreateStream({ loadStreams }) {

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title || !description) {
            alert("Please fill all fields.");
            return;
        }

        try {
            await createStream({
                title,
                description,
            });

            alert("Stream Created Successfully!");

            setTitle("");
            setDescription("");

            loadStreams();

        } catch (error) {
            console.log(error);
            alert("Unable to create stream.");
        }
    };

    return (
        <div className="card p-4 mb-4">

            <h3>Create New Stream</h3>

            <form onSubmit={handleSubmit}>

                <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="Enter Stream Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <textarea
                    className="form-control mb-3"
                    placeholder="Enter Stream Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                <button
                    className="btn btn-success"
                    type="submit"
                >
                    Create Stream
                </button>

            </form>

        </div>
    );
}

export default CreateStream;