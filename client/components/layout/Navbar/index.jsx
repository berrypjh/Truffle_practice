import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import {
  AppBar,
  Toolbar,
  Tabs,
  Box,
  FormControl,
  NativeSelect,
} from '@mui/material';

import {
  loginRequestAction,
  logoutRequestAction,
} from '$reduxsaga/request/user_request';
import { useWalletInfo } from '$hooks/web3';
import { NavbarLink } from '$components/layout/Navbar/contents';
import { RegisterCheck } from '$components/layout/Navbar/base';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';

const Navbar = () => {
  const [t, i18next] = useTranslation('lang', { useSuspense: false });

  const { userData, logInUserError } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const { account } = useWalletInfo();

  // 메타마스크 계정 전환시 확인란
  useEffect(() => {
    if (account.data === undefined) {
      return;
    }

    if (userData) {
      if (userData.metamask.toUpperCase() !== account.data.toUpperCase()) {
        let confirmAction = window.confirm(`${t('AccountChange')}`);
        if (confirmAction) {
          dispatch(loginRequestAction(account.data));
        } else {
          dispatch(logoutRequestAction());
        }
      }
    }
  }, [account.data]);

  const onChangeLang = useCallback(e => {
    console.log(e);
    // if (e) {
    //   i18next.changeLanguage('en');
    // }
  }, []);

  useEffect(() => {
    if (logInUserError) {
      alert(logInUserError);
      dispatch(logoutRequestAction());
    }
  }, [logInUserError]);

  return (
    <>
      <AppBar
        sx={{
          padding: '10px 20px ',
          background: '#0d0f1a',
          height: '100px',
        }}
        elevation={0}
      >
        <Toolbar sx={{ paddingRight: '20px' }}>
          <Link href="/">
            <span style={{ marginRight: '30px', cursor: 'pointer' }}>
              <Image
                width="80px"
                height="80px"
                src="/logoW.png"
                alt="logo"
                layout="fixed"
              />
            </span>
          </Link>

          <Tabs textColor="inherit" value={false}>
            <NavbarLink />
          </Tabs>

          <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
              <NativeSelect
                defaultValue={10}
                inputProps={{
                  name: 'age',
                  id: 'uncontrolled-native',
                }}
                onChange={onChangeLang}
              >
                <option value={10}>ko</option>
                <option value={20}>en</option>
              </NativeSelect>
            </FormControl>
          </Box>

          <RegisterCheck />
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Navbar;
