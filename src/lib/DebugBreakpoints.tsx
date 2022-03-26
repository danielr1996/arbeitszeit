export const DebugBreakpoints = ()=>{
    return process.env.NODE_ENV === 'development' ?<div className="fixed z-50 text-xs font-bold text-black p-2">
        <span className="sm:hidden rounded px-1 bg-yellow-400 p-1">XS</span>
        <span className="hidden sm:inline-block md:hidden rounded px-1 bg-yellow-400">SM</span>
        <span className="hidden sm:hidden md:inline-block lg:hidden rounded px-1 bg-yellow-400">MD</span>
        <span className="hidden lg:inline-block xl:hidden rounded px-1 bg-yellow-400">LG</span>
        <span className="hidden xl:inline-block rounded px-1 bg-yellow-400">XL</span>
    </div>:null
}
