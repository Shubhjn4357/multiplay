import YouTubePlayer from "./youtubePlayer";

const { useEffect, useState } = require("react");

const DownloadFile = ({ videoId,onRemove }) => {
  const [formats, setFormats] = useState([]);
  const [selectedFormat, setSelectedFormat] = useState("");
  const [qualityMenu, setQualtyMenu]=useState(false);

  useEffect(() => {
    const fetchFormats = async () => {
      try {
        const response = await fetch(`/api/getdownloadlink?videoId=${videoId}`);
        if (!response.ok) throw new Error("Failed to fetch formats");
        const data = await response.json();
        setFormats(data.formats);
      } catch (error) {
        console.error(error);
      }
    };

    if (videoId) {
      fetchFormats();
    }
  }, [videoId]);

  const handleDownload = (url) => {
    if (!url) return;

    const link = document.createElement("a");
    link.href = url;
    link.download = `video-${videoId}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const filterFormatsByQuality = (quality) => {
    return formats.filter(
      (format) => format.format_note && format.format_note.includes(quality)
    );
  };
  const qualityOptions = [
    "144p",
    "240p",
    "360p",
    "480p",
    "720p",
    "1080p",
    "4k",
    "8k",
    "Premium",
  ];
const toggleMenu=()=>{
  setQualtyMenu(!qualityMenu)
}

const removeDownloader=()=>{
  setSelectedFormat("")
  setQualtyMenu(false)
  setFormats([])
}
  return (
    <div className="p-2 text-grey-100 flex items-center justify-center flex-wrap">
      <YouTubePlayer videoId={videoId} onRemove={onRemove} className="max-w-sm"/>
      {formats.length > 0 ?  <div>
        <span className="flex gap-2">

      <h3 className="text-xl">Download video</h3> 
      <button
        onClick={() => handleDownload(selectedFormat)}
        disabled={!selectedFormat}
        type="button"
        className=" inline-flex bg-blue-600 disabled:bg-gray-400 hover:bg-blue-700 ml-2 px-4 py-2 text-white rounded disabled:cursor-not-allowed focus:outline-none disabled:opacity-75"
        >
        Download Video
      </button>
        </span>
      <div className="relative w-fit rounded-md">

    
          <button
            onClick={toggleMenu}
            className="flex items-center justify-center py-2 px-3 text-gray-900 hover:bg-gray-400  dark:text-white  dark:focus:text-white dark:hover:bg-gray-700 rounded-lg"
          >
            Select Quality
            </button>
           
          <div
            className={`mt-1 max-h-40 scroll ${qualityMenu ? "block": "hidden"} transition-all font-normal bg-white divide-y divide-gray-100 rounded-lg shadow w-72 dark:bg-gray-700 dark:divide-gray-600`}
          >
            <ul
              className="py-2 text-sm text-gray-700 dark:text-gray-200"
              aria-labelledby="dropdownLargeButton"
            >
          {qualityOptions.map((quality) => {
              const filteredFormats = filterFormatsByQuality(quality);
              if(!filteredFormats.length > 0){
                return;
              }
            return (
              <li key={quality} className="flex relative group items-center justify-between w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                  {quality}
               
                <div
                  
                  className="z-50 absolute left-20 top-0 w-40 mt-1 origin-bottom-left group-hover:visible invisible bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700"
                >
                  <ul
                    className="py-2 text-sm text-gray-700 dark:text-gray-200"
                   
                  >
                    {filteredFormats.map((format) => (
                    <li key={format.format_id} onClick={()=>setQualtyMenu(false)}>
                     <button  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white w-full" onClick={() => setSelectedFormat(format.url)}>
                        {format.format_note} - {format.video_ext}
                     </button>
                     
                    </li>))}
                  </ul>
                </div>
                
              </li>
          )})}
          
           </ul>
         </div> 
         </div>
          </div>:"loading..."}
    </div>
  );
};

export default DownloadFile;
