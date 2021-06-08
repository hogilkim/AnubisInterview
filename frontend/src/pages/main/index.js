import React, {useState} from 'react';
import { FormGroup, Label, Input, Form, Button } from 'reactstrap';
import api from '../../services/api'

export default function Main(){
    const [file, setFile]=useState(null);


    const submitHandler = async(evt)=>{
        evt.preventDefault();

        const fileData = new FormData();

        fileData.append("file", file);

        try {
            await api.post("/upload", fileData);
        } catch (error) {
            console.log(error);
        }
    }


    return(
        <div>
            <Form onSubmit={submitHandler}>
                <FormGroup>
                    <Label for="exampleFile">File</Label>
                    <Input type="file" onChange = {evt=>setFile(evt.target.files[0])}/>
                </FormGroup>
                <FormGroup>
                    <Button className="submit-btn">Submit</Button>
                </FormGroup>
            </Form>
        </div>

    )
}