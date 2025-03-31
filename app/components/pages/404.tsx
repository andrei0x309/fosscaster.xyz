import { Button } from "~/components/ui/button"
import { useMainStore } from "~/store/main"

export const NotFoundPage = () => {
    const { navigate } = useMainStore()

    return (
<section >
    <div className="h-full w-full shrink-0 justify-center sm:w-[540px] lg:w-[680px] py-8 mt-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-sm text-center">
            <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-6xl text-primary-600 dark:text-primary-500">404</h1>
            <p className="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">Something's missing.</p>
            <p className="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">Sorry, page cannot be found. You'll find lots to explore on the home page. </p>
            <Button className="w-full max-w-40 bg-red-600 hover:bg-red-700 text-white" onClick={() => {  navigate('/home')  } }  >Go back</Button>
        </div>   
    </div>
</section>
    );
}

export default NotFoundPage;
