import { useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import { aws } from '../AWS.js';

export default function PledgesList(props) { // we assume that either a designer or a supporter is logged in if this is rendering
    const [pledges, updatePledges] = useState();
    const project = props.project;
    const designerEmail = window.sessionStorage.getItem('designerEmail');
    const supporterEmail = window.sessionStorage.getItem('supporterEmail');
    const isLaunched = project.launched.data[0] !== 0;

    const rightButton = (pledge) => {
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
                        updatePledges(undefined);
                    }
                    else {
                    console.log(response.data.body);
                    }
                })
                .catch(console.log);
            }
            rightButton = <Button variant='danger' onClick={attemptDelete}>Delete</Button>;
        }
    
        else if (supporterEmail && isLaunched && (project.status === 'incomplete')) { // supporter view
            const attemptClaim = (e) => {
                const body = {};
                body['supporterEmail'] = supporterEmail;
                body['id'] = e.currentTarget.parentNode.parentNode.id;
                body['projectName'] = project.name;
                const data = { 'body': JSON.stringify(body) };
                aws.post('/claimPledge', data)
                .then(response => {
                    if (response.data.statusCode === 200) {
                        updatePledges(undefined);
                    }
                    else {
                        console.log(response.data.body);
                    }
                })
                .catch(console.log);
            }
            const disabled = (pledge.maxSupporters !== 0) && pledge.numSupporters >= pledge.maxSupporters;
            rightButton = <Button onClick={attemptClaim} disabled={disabled}>Claim</Button>
        }
        
        return rightButton;
    }

    const renderedPledges = () => {
        const supporterList = (supporters) => {
            if (designerEmail && isLaunched) {
                return supporters.map((supporter, index) => {
                    return (
                        <tr key={index}>
                            {supporter.supporter_email}
                        </tr>
                    );
                });
            }
        }
        return pledges.map((pledge, index) => {
            return (
                <>
                <tr key={index} id={pledge.id}>
                    <td>${pledge.cost}</td>
                    <td>{pledge.description}</td>
                    <td>{pledge.numSupporters}</td>
                    <td>{pledge.maxSupporters}</td>
                    <td>{ rightButton(pledge) }</td>
                </tr>
                {supporterList(pledge.supporterEmails)} {/* there's a warning on this. ignore it */}
                </>
            );
    })}

    const getPledges = () => {
        const pledges = [];
        const promises = [];
        for (const pledge of project.pledges) {
            const body = {};
            body['projectName'] = project.name;
            body['id'] = pledge.id;
            const data = { 'body': JSON.stringify(body) }
            promises.push(aws.post('/viewPledge', data));
        }
        Promise.all(promises)
        .then(responses => {
            for (const response of responses) {
                if (response.data.statusCode === 200) {
                    const pledge = response.data.body;
                    pledges.push(pledge);
                }
                else {
                    console.log(response.data.body);
                }
            }
            if (pledges.length === 0) {
                updatePledges(-1);
            }
            else { updatePledges(pledges); }
        })
    }

    if (typeof pledges === 'undefined') {
        return (
            <>
            <p>Loading pledge info...</p>
            { getPledges() }
            </>
        )
    }

    else if (pledges === -1) {
        return (
            <Table>
                <tbody>
                    <tr>
                        <th>No pledges found for this project</th>
                    </tr>
                </tbody>
            </Table>
        )
    }

    else {
        return (
            <Table>
                <thead>
                    <tr>
                        <th style={{width:'10%'}}>Cost</th>
                        <th style={{width:'60%'}}>Description</th>
                        <th style={{width:'10%'}}># Supporters</th>
                        <th style={{width:'10%'}}>Max Supporters</th>
                        <th style={{width: '10%'}}></th>
                    </tr>
                </thead>
                <tbody>
                    { renderedPledges() }
                </tbody>
            </Table>
            )
    }
}