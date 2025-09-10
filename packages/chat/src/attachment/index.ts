import FileCard from '../fileList/fileListCard.vue'
import FileList from '../fileList/index.vue'
import DropArea from './DropArea.vue'
import Attachment from './index.vue'
import PlaceholderUploader from './PlaceholderUploader.vue'
import SilentUploader from './silentUploader.vue'

export type * from './interface'

type AttachmentType = {
  DropArea: typeof DropArea
  FileCard: typeof FileCard
  FileList: typeof FileList
  PlaceholderUploader: typeof PlaceholderUploader
  SilentUploader: typeof SilentUploader
} & typeof Attachment
;(Attachment as AttachmentType).DropArea = DropArea
;(Attachment as AttachmentType).PlaceholderUploader = PlaceholderUploader
;(Attachment as AttachmentType).SilentUploader = SilentUploader
;(Attachment as AttachmentType).FileList = FileList
;(Attachment as AttachmentType).FileCard = FileCard

export default Attachment as AttachmentType

export { Attachment, DropArea, FileCard, FileList, PlaceholderUploader, SilentUploader }
