import CameraSource from '../../common/js/camera-source'
import { getVonageEventEmitter, isSupported, MediaPipeModelType } from '@vonage/ml-transformers'
import {setVonageMetadata, MediaProcessorConnectorInterface, MediaProcessorConnector} from '@vonage/media-processor'
import MediaProcessorHelperWorker from './js/MediaProcessorHelperWorker'
import { MediapipeMediaProcessorInterface } from './js/MediapipeInterfaces'

async function main() {
  try {
    await isSupported();
  } catch(e) {
    alert('Something bad happened: ' + e);
  }

  const githubButtonSelector: HTMLElement | null = document.getElementById("githubButton")
  const vividButtonSelector: HTMLElement | null = document.getElementById("vividButton")

  let videoSource_: CameraSource = new CameraSource()
  await videoSource_.init().then(() => {
    setMediaProcessor();
  }).catch(e => {
    alert('error initing camera, ' + e )
    return
  })

  async function setMediaProcessor() {
    setVonageMetadata({appId: 'MediaPipe Demo', sourceType: 'test'})
    let processor: MediapipeMediaProcessorInterface
    processor = new MediaProcessorHelperWorker()

    processor.init("face_detection" as MediaPipeModelType).then( () => {
      const connector: MediaProcessorConnectorInterface = new MediaProcessorConnector(processor)
      
      processor.getEventEmitter().on('error', (e => {
        console.error(e)
      }))
      processor.getEventEmitter().on('pipelineInfo', (i => {
        console.info(i)
      }))
      processor.getEventEmitter().on('warn', (w => {
        console.warn(w)
      }))

      videoSource_.setMediaProcessorConnector(connector).catch(e => {
        throw e
      })
    })    
  }
  
  if(githubButtonSelector){
    githubButtonSelector.addEventListener('click', () => {
      window.open("https://github.com/Vonage/vonage-media-transformers-samples/tree/main/examples/mediapipe/zoomAndCenterPublisher", '_blank')?.focus();
    })
  }

  if(vividButtonSelector){
    vividButtonSelector.addEventListener('click', () => {
      window.open("https://vivid.vonage.com/?path=/story/introduction-meet-vivid--meet-vivid", '_blank')?.focus();
    })
  }

}

window.onload = main;