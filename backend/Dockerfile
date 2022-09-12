# base image
FROM continuumio/miniconda3

# load in the environment.yml file
ADD environment.yml /

# create the environment
RUN conda update -n base conda -y && conda env update

