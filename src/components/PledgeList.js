import { Button, Table } from 'react-bootstrap';

export default function PledgesList(props) { // we assume that either a designer or a supporter is logged in if this is rendering
    const project = props.project;
    console.log(project);
    const designerEmail = window.sessionStorage.getItem('designerEmail');
    const supporterEmail = window.sessionStorage.getItem('supporterEmail');
    const isLaunched = project.launched.data[0] !== 0;

    let rightButton = <></>;
    if (designerEmail) {
        const attemptDelete = () => {
            console.log('attempt delete');
        }
        if (!isLaunched) rightButton = <Button variant='danger' onClick={attemptDelete}>Delete</Button>;
    }

    if (supporterEmail) {
        // supporter view
        const attemptClaim = () => {
            console.log('attempt claim');
        }
        rightButton = <Button onClick={attemptClaim}>Claim</Button> /* todo: disable if maxsupporters reached */
    }

    const renderedPledges = project.pledges.map((pledge, index) => {
        return (
            <tr key={index}>
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