import classes from './NotFoundPage.module.css'

const NotFoundPage = () => {

    return(
        <div className={classes['not-found-page']}>
            <div className={classes['err-container']}>
                <h1>404</h1>
                <h2>This url was not found on this server.</h2>
            </div>
        </div>
    )
}

export default NotFoundPage;