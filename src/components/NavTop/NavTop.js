import React, { Component } from 'react';
import axios from 'axios';
import { HiSearch } from 'react-icons/hi';
import { FiShoppingCart } from 'react-icons/fi';
import { RiHeart3Line } from 'react-icons/ri';
import { FiUser } from 'react-icons/fi';
import { Link, withRouter } from 'react-router-dom';
import { MYPAGE_MENUS } from '../navData';
import { USERINFO_API, CARTLIST_API } from '../../config';
import './NavTop.scss';

class NavTop extends Component {
  constructor() {
    super();
    this.state = {
      activateMyPage: true,
      isLogined: false,
      userInfo: '',
      cartList: [],
    };
  }

  componentDidMount() {
    if (localStorage.getItem('token')) {
      this.getUserInformation();
      this.getCartInformation();
      this.setState({ isLogined: true });
      return;
    }
    this.setState({ isLogined: false });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.cartList !== this.props.cartList) {
      // console.log("이거");
      this.getCartInformation();
      // this.setState({cartList: this.props.cartList});
    }
  }

  handleLogout = () => {
    localStorage.removeItem('token');
    this.setState({ isLogined: false });
  };

  getUserInformation = async () => {
    const userdata = await axios({
      url: USERINFO_API,
      headers: { authorization: localStorage.getItem('token') },
    });
    this.setState({ userInfo: userdata.data.message });
  };

  getCartInformation = async () => {
    // 원래는 토큰이 들어가야하지만 아직 머지가 되지 않아서 일단 임시로 이렇게!
    const cartdata = await axios({
      url: CARTLIST_API,
      headers: { authorization: localStorage.getItem('token') },
    });
    // const cartdata = await axios.get(CARTLIST_API);
    console.log(cartdata.data);
    this.setState({ cartList: cartdata.data.product });
  };

  toggleMyPageMenu = () => {
    this.setState({ activateMyPage: true });
  };

  outMypage = () => {
    this.setState({ activateMyPage: false });
  };

  goToCart = () => {
    if (this.state.isLogined) {
      return this.props.history.push('/Cart');
    }
    alert('로그인을 먼저 진행해주세요');
    this.props.history.push('/Login');
  };

  render() {
    const { activateMyPage, isLogined, cartList, userInfo } = this.state;

    return (
      <nav className='NavTop'>
        <div className='navTopContainer'>
          <div className='searchBar'>
            <form className='searchForm'>
              <input
                type='text'
                placeholder='전상품 무료배송, 반품비 월 1만원 지원'
                autoComplete='off'
              />
              <button>
                <HiSearch />
              </button>
            </form>
          </div>
          <div className='navTopIcons'>
            <ul>
              <li>
                <FiShoppingCart onClick={this.goToCart} />
                {isLogined && !!cartList.length && (
                  <span className='cartCount'>{cartList.length}</span>
                )}
              </li>
              <li>
                <RiHeart3Line />
              </li>
              <li
                onMouseLeave={this.toggleMyPageMenu}
                onMouseEnter={this.outMypage}>
                <FiUser />
                <span
                  className={`loginStatus ${
                    isLogined ? 'logined' : 'notLogined'
                  }`}>
                  {isLogined ? 'ON' : 'OFF'}
                </span>
              </li>
            </ul>
          </div>
        </div>
        {!activateMyPage && (
          <div
            className='wrapMyPage'
            onMouseLeave={this.toggleMyPageMenu}
            onMouseEnter={this.outMypage}>
            <div className='myPageMenu'>
              <ul>
                {!isLogined
                  ? [
                      <li>
                        <Link to='/Login'>
                          <span className='plaintext'>로그인</span>
                        </Link>
                      </li>,
                      <li>
                        <Link to='/SignUp'>
                          <span className='plaintext'>회원가입</span>
                        </Link>
                      </li>,
                    ]
                  : [
                      <li>
                        <Link to=''>
                          <span className='plaintext'>
                            <span className='username'>{userInfo}</span>님
                            안녕하세요
                          </span>
                        </Link>
                      </li>,
                      <li>
                        <Link to=''>
                          <span
                            className='plaintext'
                            onClick={this.handleLogout}>
                            로그아웃
                          </span>
                        </Link>
                      </li>,
                    ]}
                {MYPAGE_MENUS.map((menu) => (
                  <li key={menu.id}>
                    <Link to=''>
                      <span className='plaintext'>{menu.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </nav>
    );
  }
}

export default withRouter(NavTop);
