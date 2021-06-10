import { IPalette } from 'src/common';

const template: IPalette = {
  width: '750rpx',
  height: '1334rpx',
  background: '#FFFFFF',
  views: [
    {
      id: 'rect_10',
      type: 'rect',
      css: {
        scalable: true,
        color: '#F5F2EC',
        height: '348rpx',
        width: '750rpx',
        bottom: '0rpx',
        left: '0rpx',
        minWidth: '80rpx',
        minHeight: '80rpx',
      },
    },
    {
      id: 'rect_9',
      type: 'rect',
      css: {
        scalable: true,
        color: '#CBBD9F',
        height: '646rpx',
        width: '388rpx',
        left: '0rpx',
        top: '456rpx',
        minWidth: '80rpx',
        minHeight: '80rpx',
      },
    },
    {
      id: 'rect_8',
      type: 'rect',
      css: {
        scalable: true,
        color: '#EBE5D7',
        height: '160rpx',
        width: '360rpx',
        top: '222rpx',
        right: '0rpx',
        minWidth: '80rpx',
        minHeight: '80rpx',
      },
    },
    {
      id: 'qrcode',
      type: 'image',
      url: 'https://qhstaticssl.kujiale.com/newt/100082/image/jpeg/1623053391518/3EF9BB7ABE024959EB2A0E81078B40FA.jpeg',
      css: {
        width: '202rpx',
        height: '202rpx',
        bottom: '76rpx',
        right: '40rpx',
        borderRadius: '8rpx',
        borderColor: '#FFFFFF',
        borderWidth: '4rpx',
      },
    },
    {
      id: 'worker_type',
      type: 'text',
      text: '门店店长',
      css: {
        scalable: true,
        deletable: true,
        left: '156rpx',
        bottom: '76rpx',
        fontSize: '24rpx',
        color: '#656c75',
        lineHeight: '34rpx',
      },
    },
    {
      id: 'worker_name',
      type: 'text',
      text: 'tester',
      css: {
        scalable: true,
        deletable: true,
        fontSize: '30rpx',
        fontWeight: 'bold',
        color: '#333',
        left: '156rpx',
        bottom: '114rpx',
        width: '280rpx',
        lineHeight: '42rpx',
        maxLines: 1,
      },
    },
    {
      id: 'avatar',
      type: 'image',
      url: 'https://qhstaticssl.kujiale.com/newt/100082/image/png/1623053110600/BDA064C5ECDCB7DD50DEB466C70E2EB0.png',
      css: {
        width: '80rpx',
        height: '80rpx',
        borderRadius: '40rpx',
        left: '52rpx',
        bottom: '76rpx',
      },
    },
    {
      type: 'image',
      id: 'image-main',
      url: 'https://qhstaticssl.kujiale.com/newt/100082/image/jpeg/1623053489433/54EE335A9C385A3D99D8664CB9135F84.jpg',
      css: {
        width: '672rpx',
        height: '672rpx',
        mode: 'aspectFill',
        right: '0rpx',
        top: '314rpx',
        scalable: true,
        minWidth: '120rpx',
      },
    },
    {
      type: 'rect',
      css: {
        width: '666rpx',
        height: '2rpx',
        top: '144rpx',
        right: '0rpx',
        color: '#EBEFF5',
      },
    },
    {
      id: 'name',
      type: 'text',
      text: '一个蒙着红色布的——球？',
      css: {
        scalable: true,
        deletable: true,
        fontSize: '32rpx',
        color: '#383c42',
        maxLines: 1,
        width: '480rpx',
        left: '76rpx',
        top: '74rpx',
        lineHeight: '44rpx',
      },
    },
    {
      id: 'product',
      type: 'text',
      text: '¥9999',
      css: {
        scalable: true,
        deletable: true,
        fontSize: '80rpx',
        lineHeight: '90rpx',
        fontWeight: 'bold',
        color: '#383C42',
        textAlign: 'center',
        left: '76rpx',
        top: '170rpx',
      },
    },
  ],
};

export function getTemplate(): IPalette {
  return JSON.parse(
    JSON.stringify(template).replace(/(\d+)rpx/g, function(_, $1) {
      return `${parseInt($1) * 0.75}rpx`;
    }),
  );
}
