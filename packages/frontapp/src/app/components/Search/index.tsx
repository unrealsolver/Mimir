import React, { useState } from 'react';
import styled from '@emotion/styled';
import { colors, dimensions, fonts } from '@mimir/ui-kit';
import { ReactComponent as SearchIcon } from '../../../assets/Search.svg';

const InputSearch = styled.input`
  width: 80%;
  border: none;
  outline: none;
  margin-left: 0.58125rem;
  color: ${colors.main_black};
  font-family: ${fonts.primary}, sans-serif;

  ::placeholder {
    color: #bdbdbd;
    font-size: ${dimensions.base};
    line-height: ${dimensions.xl};
  }
`;

const WrapperInput = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 21.5625rem;
  width: 100%;
  border: 0.03125rem solid #bdbdbd;
  border-radius: ${dimensions.xl_3};
  padding: 0.8125rem 0 0.8125rem 0;

  :hover {
    border: 0.03125rem solid ${colors.accent_color};
  }
`;

const Search = () => {
  const [search, setSearch] = useState<string>('');

  const handleChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return (
    <WrapperInput>
      <SearchIcon fill="#BDBDBD" width="20" height="20" />
      <InputSearch
        value={search}
        onChange={handleChangeSearch}
        placeholder="Search by book or author"
      />
    </WrapperInput>
  );
};

export default Search;
