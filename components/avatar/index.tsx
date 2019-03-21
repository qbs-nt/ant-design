import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Icon from '../icon';
import classNames from 'classnames';
import { ConfigConsumer, ConfigConsumerProps } from '../config-provider';

export interface AvatarProps {
  /** Shape of avatar, options:`circle`, `square` */
  shape?: 'circle' | 'square';
  /*
   * Size of avatar, options: `large`, `small`, `default`
   * or a custom number size
   * */
  size?: 'large' | 'small' | 'default' | number;
  /** Src of image avatar */
  src?: string;
  /** Srcset of image avatar */
  srcSet?: string;
  /** Type of the Icon to be used in avatar */
  icon?: string;
  style?: React.CSSProperties;
  prefixCls?: string;
  className?: string;
  children?: any;
  alt?: string;
  /* callback when img load error */
  /* return false to prevent Avatar show default fallback behavior, then you can do fallback by your self*/
  onError?: () => boolean;
}

export interface AvatarState {
  scale: number;
  isImgExist: boolean;
  avatarDisplay: boolean;
}

export default class Avatar extends React.Component<AvatarProps, AvatarState> {
  static defaultProps = {
    shape: 'circle' as AvatarProps['shape'],
    size: 'default' as AvatarProps['size'],
  };

  state = {
    scale: 1,
    isImgExist: true,
    avatarDisplay: true,
  };

  private avatarChildren: any;

  componentDidMount() {
    this.setScale();
  }

  componentDidUpdate(prevProps: AvatarProps, prevState: AvatarState) {
    if (
      prevProps.children !== this.props.children ||
      (prevState.scale !== this.state.scale && this.state.scale === 1) ||
      prevState.isImgExist !== this.state.isImgExist ||
      !this.state.avatarDisplay
    ) {
      this.setScale();
      if (this.avatarChildren && this.avatarChildren.offsetWidth !== 0) {
        this.setState({
          avatarDisplay: true,
        });
      }
    } else {
      if (this.avatarChildren && this.avatarChildren.offsetWidth === 0 && this.state.scale === 1) {
        this.setState({
          avatarDisplay: false,
        });
      }
    }

    if (prevProps.src !== this.props.src) {
      this.setState({ isImgExist: true, scale: 1 });
    }
  }

  setScale = () => {
    const childrenNode = this.avatarChildren;
    // denominator is 0 is no meaning
    if (childrenNode && childrenNode.offsetWidth !== 0) {
      const childrenWidth = childrenNode.offsetWidth;
      const avatarNode = ReactDOM.findDOMNode(this) as Element;
      const avatarWidth = avatarNode.getBoundingClientRect().width;
      // add 4px gap for each side to get better performance
      if (avatarWidth - 8 < childrenWidth) {
        this.setState({
          scale: (avatarWidth - 8) / childrenWidth,
        });
      } else {
        this.setState({
          scale: 1,
        });
      }
    }
  };

  handleImgLoadError = () => {
    const { onError } = this.props;
    const errorFlag = onError ? onError() : undefined;
    if (errorFlag !== false) {
      this.setState({ isImgExist: false });
    }
  };

  renderAvatar = ({ getPrefixCls }: ConfigConsumerProps) => {
    const {
      prefixCls: customizePrefixCls,
      shape,
      size,
      src,
      srcSet,
      icon,
      className,
      alt,
      ...others
    } = this.props;

    const { isImgExist, scale } = this.state;

    const prefixCls = getPrefixCls('avatar', customizePrefixCls);

    const sizeCls = classNames({
      [`${prefixCls}-lg`]: size === 'large',
      [`${prefixCls}-sm`]: size === 'small',
    });

    const classString = classNames(prefixCls, className, sizeCls, {
      [`${prefixCls}-${shape}`]: shape,
      [`${prefixCls}-image`]: src && isImgExist,
      [`${prefixCls}-icon`]: icon,
    });

    const sizeStyle: React.CSSProperties =
      typeof size === 'number'
        ? {
            width: size,
            height: size,
            lineHeight: `${size}px`,
            fontSize: icon ? size / 2 : 18,
          }
        : {};

    let children = this.props.children;
    if (src && isImgExist) {
      children = <img src={src} srcSet={srcSet} onError={this.handleImgLoadError} alt={alt} />;
    } else if (icon) {
      children = <Icon type={icon} />;
    } else {
      const childrenNode = this.avatarChildren;
      if (childrenNode || scale !== 1) {
        const transformString = `scale(${scale}) translateX(-50%)`;
        const childrenStyle: React.CSSProperties = {
          msTransform: transformString,
          WebkitTransform: transformString,
          transform: transformString,
        };
        const sizeChildrenStyle: React.CSSProperties =
          typeof size === 'number'
            ? {
                lineHeight: `${size}px`,
              }
            : {};
        children = (
          <span
            className={`${prefixCls}-string`}
            ref={span => (this.avatarChildren = span)}
            style={{ ...sizeChildrenStyle, ...childrenStyle }}
          >
            {children}
          </span>
        );
      } else {
        children = (
          <span className={`${prefixCls}-string`} ref={span => (this.avatarChildren = span)}>
            {children}
          </span>
        );
      }
    }
    return (
      <span {...others} style={{ ...sizeStyle, ...others.style }} className={classString}>
        {children}
      </span>
    );
  };

  render() {
    return <ConfigConsumer>{this.renderAvatar}</ConfigConsumer>;
  }
}
