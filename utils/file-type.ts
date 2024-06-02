import { EnumFileType } from '../apps/file/src/entity/file.entity';

export default class FileType {
  public readonly determineFileType = (mimeType: string): EnumFileType => {
    if (mimeType.includes('audio')) return EnumFileType.AUDIO;
    if (mimeType.includes('video')) return EnumFileType.VIDEO;
    if (mimeType.includes('image')) return EnumFileType.IMAGE;
    if (mimeType.includes('document')) return EnumFileType.DOCUMENT;
    return EnumFileType.OTHER;
  };
}
