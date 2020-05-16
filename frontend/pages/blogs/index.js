import Head from 'next/head'
import Link from 'next/link'
import { withRouter } from 'next/router'
import Layout from '../../components/Layout'
import { useState, Fragment } from 'react'
import { listBlogsWithCategoriesAndTags } from '../../actions/blog';
import { API, DOMAIN, APP_NAME, FB_APP_ID } from '../../config'
import Card from '../../components/blog/Card'
import { Button } from 'reactstrap'
const Blogs = ({ blogs, categories, tags, totalBlogs, blogLimit, blogSkip, router }) => {
    const [limit, setLimit] = useState(blogLimit)
    const [skip, setSkip] = useState(0)
    const [size, setSize] = useState(totalBlogs)
    const [loadedBlogs, setLoadedBlogs] = useState([])

    const loadMore = () => {
        let toSkip = skip + limit
        listBlogsWithCategoriesAndTags(toSkip, limit).then(data => {
            if (data.error) {
                console.log(data.error)
            }
            else {
                setLoadedBlogs([...loadedBlogs, ...data.blogs])
                setSize(data.size)
                setSkip(toSkip)
            }
        })
    }

    const loadMoreButton = () => {
        return (
            size > 0 && size >= limit && (<button onClick={loadMore} className="btn btn-primary btn-lg">Load more</button>)
        )
    }
    const head = () => (
        <Head>
            <title>Programming blogs| {APP_NAME}</title>
            <meta name="description" content="Programming blogs and tutorial on react nod next vue web development" />
            <link rel="canonical" href={`${DOMAIN}${router.pathname}`} />
            <meta property="og:title" content={`Latest web developent tutorials on | ${APP_NAME}`} />
            <meta property="og:description" content="Programming blogs and tutorial on react nod next vue web development" />
            <meta property="og:type" content="website" />
            <meta property="og:url" content={`${DOMAIN}${router.pathname}`} />
            <meta property="og:site_name" content={`${APP_NAME}`} />
            <meta property="og:image" content={`${DOMAIN}/static/Images/Fantasy2.jpg`} />
            <meta property="og:image:secure_url" content={`${DOMAIN}/static/Image/Fantasy2.jpg`} />
            <meta property="og:image:type" content="image/jpg" />
            <meta property="fb:app_id" content={`${FB_APP_ID}`} />
        </Head>
    )
    const showAllBlogs = () => {
        return blogs.map((blog, i) => {

            return <article key={i}>
                <Card blog={blog} />
                <hr />
            </article>
        })
    }

    const showAllCategories = () => {
        if (categories) {
            return categories.map((b, i) => {
                return <Link href={`/categories/${b.slug}`} key={i}>
                    <a className="btn btn-primary mr-1 ml-1 mt-3">{b.name}</a>
                </Link>
            })
        }

    }

    const showAllTags = () => {
        return tags.map((b, i) => {
            return <Link href={`/tags/${b.slug}`} key={i}>
                <a className="btn btn-outline-primary mr-1 ml-1 mt-3">{b.name}</a>
            </Link>
        })
    }

    const showLoadedBlogs = () => {
        return loadedBlogs.map((blog, i) => {
            return <article key={i}>
                <Card blog={blog} />
            </article>
        })
    }
    return <Fragment>
        {head()}
        <Layout>
            <main>
                <div className="container-fluid">
                    <header>
                        <div className="col-md-12 pt-3">
                            <h1 className="display-4 font-weigth-bold text-center">
                                Programming Blogs and Tutorials
                         </h1>
                        </div>
                        <section>
                            <div className="pb-5 text-center">

                                {showAllCategories()}
                                <br />
                                {showAllTags()}
                            </div>

                        </section>
                    </header>
                </div>
                <div className="container-fluid">
                    {showAllBlogs()}
                </div>
                <div className="container-fluid">
                    {showLoadedBlogs()}
                </div>
                <div className="text-center pt-5 pb-5">
                    {loadMoreButton()}
                </div>
            </main>
        </Layout>
    </Fragment>
}


Blogs.getInitialProps = () => {
    let skip = 0
    let limit = 2
    return listBlogsWithCategoriesAndTags(skip, limit).then(data => {
        if (data.error) {
            console.log(data.error)
        } else {
            return {
                blogs: data.blogs, categories: data.categories, tags: data.tags, totalBlogs: data.size, blogLimit: limit, blogSkip: skip
            }
        }

    })
}
export default withRouter(Blogs);