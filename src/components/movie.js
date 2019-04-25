import React, { Component }  from 'react';
import {connect} from "react-redux";
import {
    Glyphicon,
    Panel,
    ListGroup,
    ListGroupItem,
    Form,
    FormGroup,
    Col,
    ControlLabel,
    FormControl, Button
} from 'react-bootstrap'
import { Image } from 'react-bootstrap'
import { withRouter } from "react-router-dom";
import {fetchMovie} from "../actions/movieActions";
import runtimeEnv from "@mars/heroku-js-runtime-env";

//support routing by creating a new component

class Movie extends Component {

    //make constructor that takes in prop look at the login.js and cpy the this.state and change the state details
    constructor(props) {
        super(props);
        //this.Reload = this.Reload.bind(this);  //kind of like prototypes for the function call
        this.PostReview = this.PostReview.bind(this);
        this.state = {
            details:{
                review: "",
                rating: 0
            }

        };
    }

    PostReview()
    {
        const env = runtimeEnv();
        return fetch(`${env.REACT_APP_API_URL}/review`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
            mode: 'cors'})
            .then( (response) => {
                if (!response.ok) {
                    throw Error(response.statusText);
                }
                return response.json();
            })
            .then( (res) => {
                window.location.reload();
            })
            .catch( (e) => console.log(e) );
    }
    componentDidMount() {
        const {dispatch} = this.props;
        if (this.props.selectedMovie == null)
            dispatch(fetchMovie(this.props.movieId));
    }

    render() {
        const ActorInfo = ({actors}) => {
            return actors.map((actor, i) =>
                <p key={i}>
                    <b>{actor.actorName}</b> {actor.characterName}
                </p>
            );
        };

        const ReviewInfo = ({reviews}) => {
            return reviews.map((review, i) =>
                <p key={i}>
                <b>{review.username}</b> {review.review}
                    <Glyphicon glyph={'star'} /> {review.rating}
                </p>
            );
        };

        const DetailInfo = ({currentMovie}) => {
            if (!currentMovie) { // evaluates to true if currentMovie is null
                return <div>Loading...</div>;
            }
            return (//make a <Form> under </ListGroup>
                <Panel>
                    <Panel.Heading>Movie Details</Panel.Heading>
                    <Panel.Body><Image className="image" src={currentMovie.imageUrl} thumbnail /></Panel.Body>
                    <ListGroup>
                        <ListGroupItem>{currentMovie.title}</ListGroupItem>
                        <ListGroupItem><ActorInfo actors={currentMovie.actors} /></ListGroupItem>
                        <ListGroupItem><h4><Glyphicon glyph={'star'} /> {currentMovie.avgRating} </h4></ListGroupItem>
                    </ListGroup>
                    <Panel.Body><ReviewInfo reviews={currentMovie.reviews} /></Panel.Body>


                    <Form horizontal>
                        <FormGroup controlId="review">
                            <Col componentClass={ControlLabel} sm={2}>
                                Review
                            </Col>
                            <Col sm={10}>
                                <FormControl onChange={this.updateDetails} value={this.state.details.review} type="text" placeholder="Enter review here" />
                            </Col>
                        </FormGroup>

                        <FormGroup controlId="rating">
                            <Col componentClass={ControlLabel} sm={2}>
                                Rating
                            </Col>
                            <Col sm={10}>
                                <FormControl onChange={this.updateDetails} value={this.state.details.rating} type="number" placeholder="Rating" />
                            </Col>
                        </FormGroup>

                        <FormGroup>
                            <Col smOffset={2} sm={10}>
                                <Button onClick={this.PostReview}>PostRating</Button>
                            </Col>
                        </FormGroup>
                    </Form>

                </Panel>
            );
        };
        return (
            <DetailInfo currentMovie={this.props.selectedMovie} />
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    console.log(ownProps);
    return {
        selectedMovie: state.movie.selectedMovie,
        movieId: ownProps.match.params.movieId
    }
}

export default withRouter(connect(mapStateToProps)(Movie));