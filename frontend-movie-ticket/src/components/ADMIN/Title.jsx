
function Title({text1, text2}) {
  return (
    <div>
        <h1 className="text-2xl">
            {text1}<span className="font-medium text-amber-300">{text2}</span>
        </h1>
    </div>
  )
}

export default Title