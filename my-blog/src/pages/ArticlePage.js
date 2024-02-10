import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import NotFoundPage from './NotFoundPage';
import CommentsList from '../components/CommentsList';
import AddCommentForm from '../components/AddCommentForm';
import articles from './article-content';
import useUser from  '../hooks/useUser';
import LoginPage from './LoginPage';


const ArticlePage = () => {
    const [articleInfo, setArticleInfo] = useState({ upvotes: 0, comments: [],canUpvote:false });
    const {canUpvote}=articleInfo;
    const { articleId } = useParams();

    const{user,isLoading}=useUser();
    
    // block to connect front end to back end: Start
     // introduced axios and useeffect  hooks for making a request to the server.
    useEffect(() => {
        const loadArticleInfo = async () => {
            const token=user && await user.getIdToken();
            const headers=token?{authtoken:token}:{};
            const response = await axios.get(`/api/articles/${articleId}`,{headers});//adding token
            const newArticleInfo = response.data;
            setArticleInfo(newArticleInfo);
        }
        if (!isLoading){
            loadArticleInfo();
        }
    }, [isLoading,user]);
     // added an empty array at the end so that the random number doesn't generate every second
     // block to connect front end to back end: End
     // Fetching article from the local articles array
    const article = articles.find(article => article.name === articleId);


    // Function for upvote button
    const addUpvote = async () => {
        const token=user && await user.getIdToken();
        const headers=token?{authtoken:token}:{};
        const response = await axios.get(`/api/articles/${articleId}/upvote`,null,headers);//adding token
        const updatedArticle = response.data;
        setArticleInfo(updatedArticle);
    }



    if (!article) {
        return <NotFoundPage />
    }

    return (
        <>
        <h1>{article.title}</h1>
        <div className="upvotes-section">
            {user   //Adding this so that only logged in users can see the button to upvote
                ?   <button onClick={addUpvote}>{canUpvote ? 'Upvote' : 'Already Upvoted'}</button>
                :   <button onClick={LoginPage}> Log in to upvote</button>   } 

            <p>This article has {articleInfo.upvotes} upvote(s)</p>
        </div>
        {article.content.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
        ))}
    
            {user   //Adding this so that only logged in users can comment
            ?   <AddCommentForm
                articleName={articleId}
                onArticleUpdated={updatedArticle => setArticleInfo(updatedArticle)} />
            :   <button onClick={LoginPage}>Log in to  comment</button>}
        <CommentsList comments={articleInfo.comments} />
        </>
    );
}

export default ArticlePage;