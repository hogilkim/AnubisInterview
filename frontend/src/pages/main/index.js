import React from 'react';
import { FormGroup, Label, Input } from 'reactstrap';
import api from '../../services/api'

export default function Main(){
    return(
        <div>
            <FormGroup>
                <Label for="exampleFile">File</Label>
                <Input type="file" name="file" id="exampleFile" />
            </FormGroup>
        </div>

    )
}