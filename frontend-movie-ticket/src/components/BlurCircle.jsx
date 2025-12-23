
function BlurCircle({top="auto", left="auto", right="auto", bottom="auto"}) {
  return (
    <div className="mt-3 absolute -z-50 h-20 w-50 aspect-square  bg-pink-400 blur-3xl pointer-events-none"
     style={{top:top, left:left, right:right, bottom:bottom}}>
    </div>
  )
}

export default BlurCircle