import React from 'react';
import styled from '@emotion/styled';
import { dimensions } from '@mimir/ui-kit';
import { ButtonGroup } from './BookPreview';
import { useGetAllMaterialsQuery } from '@mimir/apollo-client';
import { ReactComponent as ScrollButtonRight } from '../../assets/ArrowButtonRight.svg';
import { ReactComponent as ScrollButtonLeft } from '../../assets/ArrowButtonLeft.svg';
import CategoriesList from '../components/CategoriesList';
import AllBooksList from '../components/AllBooksList';
import { useAppSelector } from '../hooks/useTypedSelector';

const ContentWrapper = styled.div`
  margin: 3rem 0 ${dimensions.xl_6};
`;

const TopicNameWrapper = styled.div`
  margin-bottom: ${dimensions.xl_2};
  display: flex;
`;

const MainText = styled.h3`
  margin: 3.5rem 0 ${dimensions.xl_6};
  font-weight: 700;
  font-size: ${dimensions.xl_2};
`;

const Topics = styled.h5`
  font-weight: 700;
  flex: 1;
  font-size: ${dimensions.xl};
`;

const SearchPage = () => {
  const { location } = useAppSelector((state) => state.user);
  const { data, loading } = useGetAllMaterialsQuery({
    variables: { location_id: location.id },
  });
  const allCategories = data?.getAllMaterials.reduce(
    (acc, material) => ({
      ...acc,
      [material?.category as string]: acc[material?.category as string]
        ? acc[material?.category as string] + 1
        : 1,
    }),
    {} as { [category: string]: number }
  );

  if (loading) return <h1>Loading...</h1>;

  return (
    <>
      <MainText>Categories</MainText>
      <CategoriesList allCategories={allCategories} />
      {allCategories &&
        Object.keys(allCategories).map((category) => {
          return (
            <ContentWrapper key={category}>
              <TopicNameWrapper>
                <Topics>{category}</Topics>
                <ButtonGroup>
                  <ScrollButtonLeft />
                  <ScrollButtonRight />
                </ButtonGroup>
              </TopicNameWrapper>
              <AllBooksList
                sortingCategory={category}
                items={data?.getAllMaterials}
              />
            </ContentWrapper>
          );
        })}
    </>
  );
};

export default SearchPage;
