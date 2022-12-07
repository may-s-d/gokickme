import { useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import { aws } from '../AWS.js';

export default function PledgesList(props) { // we assume that either a designer or a supporter is logged in if this is rendering
    const [counter, updateCounter] = useState(0);
    const project = props.project;
    const designerEmail = window.sessionStorage.getItem('designerEmail');
    const supporterEmail = window.sessionStorage.getItem('supporterEmail');
    const isLaunched = project.launched.data[0] !== 0;

    let rightButton = <></>;
    if (designerEmail && !isLaunched) {
        const attemptDelete = (e) => {
            const body = {};
            body['designerEmail'] = designerEmail;
            body['id'] = e.currentTarget.parentNode.parentNode.id;
            body['projectName'] = project.name;
            const data = { 'body': JSON.stringify(body) };
            aws.post('/deletePledge', data)
            .then(response => {
                if (response.data.statusCode === 200) {
                    updateCounter(counter => counter+1);
                }
                else {
                console.log(response.data.body);
                }
            })
            .catch(console.log);
        }
        rightButton = <Button variant='danger' onClick={attemptDelete}>Delete</Button>;
    }

    if (supporterEmail) { // supporter view
        const attemptClaim = (e) => {
            const body = {};
            body['supporterEmail'] = supporterEmail;
            body['id'] = e.currentTarget.parentNode.parentNode.id;
            body['projectName'] = project.name;
            const data = { 'body': JSON.stringify(body) };
            aws.post('/claimPledge', data)
            .then(response => {
                if (response.data.statusCode === 200) {
                    updateCounter(counter => counter+1);
                }
                else {
                    console.log(response.data.body);
                }
            })
            .catch(console.log);
        }
        rightButton = <Button onClick={attemptClaim}>Claim</Button> /* todo: disable if maxsupporters reached */
    }

    const renderedPledges = project.pledges.map((pledge, index) => {
        return (
            <tr key={index} id={pledge.id}>
                <td>${pledge.cost}</td>
                <td>{pledge.description}</td>
                <td>{pledge.maxSupporters}</td>
                <td>{ rightButton }</td>
            </tr>
        )
    })
    return (
        <Table>
            <thead>
                <tr>
                    <th style={{width:'10%'}}>Cost</th>
                    <th style={{width:'70%'}}>Description</th>
                    <th style={{width:'10%'}}>Max Supporters</th>
                    <th style={{width: '10%'}}></th>
                </tr>
            </thead>
            <tbody>
                { renderedPledges }
            </tbody>
        </Table>
    )
}