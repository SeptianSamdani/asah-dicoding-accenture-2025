export default function Loader() {
  return (
    <div style={
        {
            display:'grid',
            placeItems:'center',
            padding:'2rem'
        }
    }>
    <div style={
    {
        width:40,
        height:40,
        border:'4px solid #e5e7eb',
        borderTopColor:'#111',
        borderRadius:'50%', 
        animation:'spin .8s linear infinite'
    }}/>
    <style>
        {
            `@keyframes spin { to { transform: rotate(360deg) } }`
        }
    </style>
    </div>
  );
}
