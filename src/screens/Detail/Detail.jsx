import React, { useEffect, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Stack, Box, Link, Grid, Typography, styled } from '@mui/material'
import { TagScore, CommentItem } from '~/components'
import { Icon } from '~/components/Icons'
import { Stars } from '~/components/Star'
import dotImg from '~/assets/svgs/dot.svg'
import emailImg from '~/assets/svgs/email.svg'
import internetImg from '~/assets/svgs/internet.svg'
import detailImg from '~/assets/images/detail.jpg'
import { blue, grey, TextHeading } from '~/styles'
import { BoxDescription } from './BoxDescription'
import Circel from '~/assets/svgs/circle.svg'
import { List } from '~/components/List'
import { Button } from '~/components/Buttons'
import { AffiliateOfferItem } from '~/screens/Home'
import { BoxWithPagination } from '~/components/Pagination'
import { getDataDetail, getWebsite, getListComments } from '~/apis'
import { FlexBoxAlignCenterJustifyBetween, FlexBoxAlignCenter } from '~/styles'
import { ReviewForm } from './ReviewForm'
import { useQuery } from 'react-query'
import { ListSkeleton } from '~/components/Skeleton'
import { getUserLocalStorage } from '~/libs/function/user'
import { LoginDialog } from '~/components/Dialogs/LoginDialog'
import { type } from '@testing-library/user-event/dist/type'
import { financial } from '~/libs/function'
import { useAtom } from 'jotai'
import { userAtom } from '~/libs/auth'
import { useState } from 'react'

const desc =
  'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sapiente ex fugit perspiciatis quas cum, saepe inventore tempore, hic, aliquam animi accusantium. Facere adipisci, eiusquo fugit voluptatem corporis accusamus animi? Lorem ipsum dolor, sit amet consecteturadipisicing elit. Sapiente ex fugit perspiciatis quas cum, saepe inventore tempore, hic,aliquam animi accusantium. Facere adipisci, eius quo fugit voluptatem corporis accusamusanimi? Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sapiente ex fugitperspiciatis quas cum, saepe inventore tempore, hic, aliquam animi accusantium. Facereadipisci, eius quo fugit voluptatem corporis accusamus animi? Lorem ipsum dolor, sit ametconsectetur adipisicing elit. Sapiente ex fugit perspiciatis quas cum, saepe inventoretempore, hic, aliquam animi accusantium. Facere adipisci, eius quo fugit voluptatemcorporis accusamus animi?'

const data1 = [
  {
    title: 'Offers'
  },
  {
    title: 'Tracking'
  },
  {
    title: 'Payout'
  },
  {
    title: 'Support'
  }
]

const userInfo = getUserLocalStorage()

export const Detail = () => {
  const user = useAtom(userAtom)
  const [isUserReviewed, setIsUserReviewed] = useState(false)

  const [open, setOpen] = React.useState(false)
  const [openDialog, setOpenDialog] = React.useState(null)
  const [refetchBoxComment, setRefetchBoxComment] = React.useState(false)

  const { slug, id } = useParams()
  const userID = user[0]?.id
  const {
    isLoading,
    error,
    data: dataDetail
  } = useQuery('website-detail' + id + userID, () => getWebsite(id, userID))

  const {
    isLoading: isLoadingComment,
    error: errorComment,
    data: dataComment,
    refetch: refetchComment
  } = useQuery('list-comment', () => getListComments(id))

  useEffect(() => {
    dataDetail?.reviews.forEach((review) => {
      if (review.user_id === user[0]?.id) {
        setIsUserReviewed(true)``
        return true
      }
    })
  }, [])
  // useEffect(() => {
  //   console.log('dataComment', dataComment)
  // }, [dataComment])

  const handleClickOpen = () => {
    if (userInfo) {
      setOpen(true)
      if (!dataDetail?.reviews_remain) {
        alert(
          'Your turn of review for this Network is run out of for this day, please try tomorrow!'
        )
        return
      }
    } else {
      setOpenDialog(true)
    }
  }
  const handleClose = () => {
    setOpen(false)
  }
  const handleOpenEditReview = () => {
    setOpen(true)
  }
  const handleCloseDialog = () => {
    setOpenDialog(false)
  }

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  console.log('data detail:', dataDetail)
  const affiliateProgramDetails = useMemo(
    () => [
      {
        id: 1,
        title: 'Number of Offers',
        content: dataDetail?.offer_count
      },
      {
        id: 2,
        title: 'Commission Type',
        content: dataDetail?.commission_type
      },
      {
        id: 3,
        title: 'Minimum Payment',
        content: '$' + dataDetail?.minimum_payment
      },
      {
        id: 4,
        title: 'Payment Frequency',
        content: dataDetail?.payment_frequency
      },
      {
        id: 5,
        title: 'Payment Method',
        content: dataDetail?.payment_method
      },
      {
        id: 6,
        title: 'Referral Commission',
        content: dataDetail?.referral_commission
      },
      {
        id: 7,
        title: 'Tracking Software',
        content: dataDetail?.tracking_software
      },
      {
        id: 8,
        title: 'Tracking Link',
        content: dataDetail?.tracking_link
      },
      {
        id: 9,
        title: 'Affiliate Manager',
        content: dataDetail?.manager
      }

      // {
      //   id: 5,
      //   title: 'Commission Type',
      //   content: 'CPA, CPL, CGR'
      // },
      // {
      //   id: 6,
      //   title: 'Minimum Payment',
      //   content: '$100'
      // }
    ],
    [dataDetail, isLoading, error]
  )
  const approciateName = ['Excellent', 'Very Good', 'Averge', 'Poor', 'Terrible']
  let approciateArray = []
  approciateName.map((name, index) => {
    let countScoreReview = 0
    dataDetail?.reviews.map((review) => {
      if (review?.score == 5 - index) {
        countScoreReview++
      }
    })
    approciateArray.push({
      name: name,
      value: countScoreReview
    })
  })
  console.log('ge', affiliateProgramDetails)
  return (
    <>
      {isLoading || isLoadingComment ? (
        <ListSkeleton />
      ) : error || errorComment ? (
        <h1>Error ...</h1>
      ) : (
        <>
          <ReviewForm
            open={open}
            handleClose={handleClose}
            refetchComment={refetchComment}
            handleRefetchComment={() => setRefetchBoxComment(!refetchBoxComment)}
            websiteId={id}
            title={
              <Typography sx={{ color: '#2779bd', fontSize: '1.5rem', fontWeight: 'bold' }}>
                {dataDetail?.name}
              </Typography>
            }
          />
          <Stack>
            {/* Affiliate Network */}

            <Stack
              sx={{
                px: '20px',
                pb: '20px',
                backgroundColor: '#fff',
                borderTop: `3px solid ${blue['border']}`,
                mb: '8px'
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  fontSize: '0.75rem',
                  color: '#b8c2cc',
                  py: '12px',
                  borderBottom: `1px solid #d6eaff`
                }}
              >
                <Box
                  component="img"
                  src={dotImg}
                  alt="dot img"
                  sx={{
                    width: '12px',
                    height: '12px',
                    position: 'relative',
                    top: '-1px',
                    fill: 'current-color'
                  }}
                />
                <Link
                  sx={{
                    textDecoration: 'none',
                    color: 'inherit',
                    fontWeight: '600',
                    '&:hover': {
                      color: '#8795a1',
                      cursor: 'pointer'
                    }
                  }}
                >
                  Affiliate Network
                </Link>
              </Box>

              <Grid container sx={{ py: '12px' }} justifyContent="space-between">
                <Grid item xs={12} sm={6}>
                  <Stack sx={{ flex: 1 }}>
                    <Typography
                      variant="h1"
                      sx={{
                        fontSize: '1.25rem',
                        mb: '12px',
                        textTransform: 'capitalize',
                        fontWeight: '700'
                      }}
                    >
                      {dataDetail?.name}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                      <Stack direction="row">
                        <Stars rating={dataDetail?.aveScore} />
                        <TextGrey ml={1}>{dataDetail?.reviews.length} reviews</TextGrey>
                      </Stack>
                      <Stack direction="row" gap={0.5}>
                        <Icon src={emailImg} sx={{ width: '12px', height: '12px' }} />
                        <Icon src={internetImg} sx={{ width: '12px', height: '12px' }} />
                        <Icon src={emailImg} sx={{ width: '12px', height: '12px' }} />
                        <Icon src={internetImg} sx={{ width: '12px', height: '12px' }} />
                      </Stack>
                    </Box>

                    <Stack direction="row" spacing="12px" mt="12px" sx={{ width: '100%' }}>
                      <TagScore label="offers" score={financial(dataDetail?.avg_offer)} />
                      <TagScore label="tracking" score={financial(dataDetail?.avg_tracking)} />
                      <TagScore label="support" score={financial(dataDetail?.avg_support)} />
                      <TagScore label="payout" score={financial(dataDetail?.avg_payout)} />
                    </Stack>
                  </Stack>

                  <Stack
                    direction="row"
                    py="0.75rem"
                    mt="0.75rem"
                    gap="8px"
                    borderTop="1px dashed #dae1e7"
                  >
                    <Button
                      disabled={isUserReviewed}
                      type="button-blue"
                      onClick={() => {
                        handleClickOpen()
                      }}
                    >
                      Write a Review
                    </Button>
                    <Button type="button-red" href={dataDetail?.link} targer="_blank">
                      Join now
                    </Button>
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box component="img" src={detailImg} width="100%" />
                </Grid>
              </Grid>
              <BoxDescription desc={dataDetail?.description} isStringToHtml={true} />
            </Stack>

            {/* End Affiliate Network */}

            {/* Affiliate Network Details */}

            <Grid container px="1.25rem" mb="8px" backgroundColor="#fff">
              <Grid item sm={9} xs={12} py="16px" pr="0.5rem" borderRight="1px solid #f1f5f8">
                <Stack>
                  <TextHeading pb="12px">Affiliate Network Details</TextHeading>

                  {affiliateProgramDetails.map((item, index) => (
                    <Grid
                      container
                      key={index}
                      sx={{ py: '0.75rem', borderTop: '1px solid #f1f5f8' }}
                    >
                      <Grid item md={4}>
                        <TextGrey>{item.title}</TextGrey>
                      </Grid>
                      <Grid item md={8}>
                        <TextGrey>
                          {': '}
                          {item.content ? item.content : 'N/A'}
                        </TextGrey>
                      </Grid>
                    </Grid>
                  ))}
                </Stack>
              </Grid>
              <Grid item sm={3} xs={12} mt="20px">
                <Stack ml="20px" sx={{ textAlign: 'center' }}>
                  <TextHeading pb="12px">Rating Distribution</TextHeading>
                  <Box
                    sx={{
                      width: '100%',
                      textAlign: 'center',
                      py: '0.75rem',
                      position: 'relative'
                    }}
                  >
                    <Box
                      component="img"
                      src={Circel}
                      sx={{
                        width: {
                          sm: '60px',
                          xs: '90px'
                        },
                        height: {
                          sm: '60px',
                          xs: '90px'
                        }
                      }}
                    />
                    <TextGrey
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        fontSize: {
                          xs: '1rem',
                          sm: '0.825rem'
                        }
                      }}
                    >
                      {dataDetail?.rating}
                    </TextGrey>
                  </Box>

                  <Box>
                    {approciateArray.map((item, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          p: '8px 12px'
                        }}
                      >
                        <Stack direction="row" gap="12px" alignItems="center">
                          <span
                            style={{
                              width: '0.75rem',
                              height: '0.75rem',
                              backgroundColor: item?.color ?? '#6cb2eb',
                              display: 'inline-block',
                              borderRadius: '2px'
                            }}
                          ></span>
                          <TextGrey>{item.name}</TextGrey>
                        </Stack>
                        <TextHeading>{item.value}</TextHeading>
                      </Box>
                    ))}
                  </Box>

                  <Box pt="1rem">
                    {data1.map((item, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          p: '8px 12px'
                        }}
                      >
                        <TextGrey sx={{ width: '100%', textAlign: 'left' }}>{item.title}</TextGrey>
                        <Bar />
                      </Box>
                    ))}
                  </Box>
                </Stack>
              </Grid>
            </Grid>

            {/* End Affiliate Network Details */}

            {/* Affiliate Reviews */}
            <Stack sx={{ backgroundColor: 'white' }}>
              <BoxWithPagination
                removePadding={true}
                api={getListComments}
                paramsApi={{ id: Number(id), user_id: user[0]?.id }}
                refetchBoxComment={refetchBoxComment}
              >
                <List
                  networkName={dataDetail?.name}
                  refetchComment={refetchComment}
                  handleRefetchComment={() => setRefetchBoxComment(!refetchBoxComment)}
                  handleOpenEditReview={handleOpenEditReview}
                  sx={{ px: 3, pb: 2 }}
                  header={() => (
                    <FlexBoxAlignCenterJustifyBetween
                      sx={{
                        flexDirection: {
                          xs: 'column',
                          md: 'row'
                        }
                      }}
                      py="16px"
                      borderBottom="1px solid #d6eaff"
                    >
                      <FlexBoxAlignCenter gap="1.25rem">
                        <Button type="button-blue">
                          {' '}
                          All Reviews ({dataDetail?.reviews.length})
                        </Button>
                        <Button type="button-grey">Payment Proofs</Button>
                        <Button type="button-grey">Questions</Button>
                      </FlexBoxAlignCenter>
                      <FlexBoxAlignCenter gap="8px">
                        <TextGrey>Sort:</TextGrey>
                        <select style={{ minWidth: '128px' }}>
                          <option value="1">Most recent</option>
                          <option value="2">Popular</option>
                          <option value="3">Oldest first</option>
                        </select>
                      </FlexBoxAlignCenter>
                    </FlexBoxAlignCenterJustifyBetween>
                  )}
                  Item={CommentItem}
                  footer={() => <>{/* <button>write a review</button> */}</>}
                />
              </BoxWithPagination>
            </Stack>
            {/* End Affiliate Reviews */}
          </Stack>
        </>
      )}

      {/* login dialog */}
      <LoginDialog open={openDialog} title="Login" handleClose={handleCloseDialog} />
    </>
  )
}

export const TextGrey = styled(Typography)({
  fontSize: '.825rem',
  color: grey['text'],
  fontWeight: '600'
})

export const Bar = styled(Box)({
  width: '100%',
  height: '5px',
  backgroundColor: '#3490dc',
  borderRadius: '2px'
})
