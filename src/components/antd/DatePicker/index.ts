import { Dayjs } from 'dayjs';
// eslint-disable-next-line
import dayjsGenerateConfig from 'rc-picker/lib/generate/dayjs';
import generatePicker from 'antd/es/date-picker/generatePicker';
import 'antd/es/date-picker/style';

const DatePicker = generatePicker<Dayjs>(dayjsGenerateConfig);

export default DatePicker;
