import { IView } from 'mina-painter/types/painter-taro';

export const customActionStyle = {
  scale: {
    textIcon: '/assets/images/painter-switch.png',
    imageIcon: '/assets/images/painter-scale.png',
  },
  delete: {
    icon: '/assets/images/painter-close.png',
  },
};

export const colors = [
  '#383C42',
  '#656C75',
  '#949DA8',
  '#FFFFFF',
  '#FF2B00',
  '#C90F00',
  '#FF4081',
  '#FFA155',
  '#FFD500',
  '#FFF5B7',
  '#FFF2E5',
  '#16D9A8',
  '#00CDFF',
  '#3887FF',
];

export interface IPalette {
  background: string;
  width: string;
  height: string;
  views: Array<IView>;
}

export function getBlankTextView(text?: string): IView {
  return {
    type: 'text',
    text: text || '',
    id: `text_${new Date().getTime()}${Math.ceil(Math.random() * 10)}`,
    css: {
      scalable: true,
      deletable: true,
      width: '384rpx',
      fontSize: '36rpx',
      color: '#000',
      textAlign: 'center',
      padding: '0 8rpx 8rpx 8rpx',
      top: '50%',
      left: '50%',
      align: 'center',
      verticalAlign: 'center',
    },
  };
}
